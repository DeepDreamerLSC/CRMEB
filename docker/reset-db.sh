#!/usr/bin/env bash
# 重置 CRMEB 数据库（正确字符集导入）
# 背景：mysql 客户端不带 --default-character-set 导入会把 UTF-8 SQL 双重编码，
# 症状是界面中文乱码（å†°å†°åœœ 形态）。本脚本总是用 utf8mb4 导入。
set -euo pipefail
cd "$(dirname "$0")/.."

docker compose exec -T mysql mysql -uroot -proot123 -e \
  "DROP DATABASE IF EXISTS crmeb; CREATE DATABASE crmeb DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"
docker compose exec -T mysql mysql --default-character-set=utf8mb4 -uroot -proot123 crmeb \
  < crmeb/public/install/crmeb.sql

# 演示数据缺陷清理（交叉污染的属性行，详见 git 历史）
docker compose exec -T mysql mysql --default-character-set=utf8mb4 -uroot -proot123 -e "
DELETE FROM crmeb.eb_store_product_attr WHERE product_id IN (1,2) AND (attr_values LIKE '%深空灰色%' OR attr_name IN ('版本','型号'));
DELETE FROM crmeb.eb_store_product_attr WHERE product_id = 3;
DELETE FROM crmeb.eb_store_product_attr_value WHERE product_id=1 AND type IN (2,3,4);
DELETE FROM crmeb.eb_store_product_attr_value WHERE product_id=2 AND type=4;
DELETE FROM crmeb.eb_store_product_attr WHERE product_id=2 AND type=4;
DELETE FROM crmeb.eb_store_product_attr WHERE product_id=4 AND type=1;
DELETE FROM crmeb.eb_store_product_attr_value WHERE product_id=4 AND type=1;
"

# 清文件缓存（否则后台菜单等缓存仍是旧数据）
rm -rf crmeb/runtime/cache/* crmeb/runtime/temp/*

echo "数据库已重置（157 表 + 缺陷清理），缓存已清。后台需重新登录。"
