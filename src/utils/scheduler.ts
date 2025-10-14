import cron from 'node-cron';
import { pool } from '../db/connection';

cron.schedule('0 0 * * *', async () => {
  console.log('🧹 Ejecutando limpieza de tareas vencidas...');
  try {
    const res = await pool.query(
      `DELETE FROM tasks
       WHERE due_date < NOW()`
    );
    console.log(`✅ Tareas vencidas eliminadas: ${res.rowCount}`);
  } catch (err) {
    console.error('❌ Error al eliminar tareas vencidas:', err);
  }
})