import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://truyenchu_user:iQGg2qtFZmCNpKaA1E2tb3pMQoNZuLtI@dpg-d30ij6vdiees73fvm34g-a.oregon-postgres.render.com/truyenchu',
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;