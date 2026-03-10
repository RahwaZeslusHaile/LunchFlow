import pkg from "pg"
const {Pool} =pkg
const pool = new Pool({
  user: "aida",
  host: "localhost",
  database: "Launch",
  password: "",
  port: 5432
});

export default pool;