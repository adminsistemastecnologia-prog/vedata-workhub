-- ============================================
-- LIMPAR DADOS EXISTENTES (Execute ANTES do schema.sql)
-- ============================================

-- Remover dados antigas (se existirem)
DROP TABLE IF EXISTS task_comments CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Remover tipos customizados
DROP TYPE IF EXISTS task_priority CASCADE;
DROP TYPE IF EXISTS task_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Confirmar conclusão
SELECT 'Limpeza concluída! Agora execute o schema.sql' AS status;
