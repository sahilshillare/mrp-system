-- AlterTable
CREATE SEQUENCE sales_order_lines_sales_order_line_id_seq;
ALTER TABLE "sales_order_lines" ALTER COLUMN "sales_order_line_id" SET DEFAULT nextval('sales_order_lines_sales_order_line_id_seq');
ALTER SEQUENCE sales_order_lines_sales_order_line_id_seq OWNED BY "sales_order_lines"."sales_order_line_id";
