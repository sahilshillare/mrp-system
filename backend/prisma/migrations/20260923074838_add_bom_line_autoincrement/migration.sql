-- AlterTable
CREATE SEQUENCE bom_lines_bom_line_id_seq;
ALTER TABLE "bom_lines" ALTER COLUMN "bom_line_id" SET DEFAULT nextval('bom_lines_bom_line_id_seq');
ALTER SEQUENCE bom_lines_bom_line_id_seq OWNED BY "bom_lines"."bom_line_id";
