import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const loginMiddleware = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("loginData")
      .select("id,username,password,loginTime")
      .eq("username", req.body?.username)
      .eq("password", req.body?.password)
      .limit(1)
      .single();

    if (!error) {
      req.locals = data;
      const { error: updatedError } = await supabase
        .from("loginData")
        .update({ loginTime: [...data.loginTime, new Date().toLocaleString()] })
        .eq("username", req.body?.username);

      next();
    } else {
      next({ error: error });
    }
  } catch (error) {
    next({ error: error });
  }
};

export { loginMiddleware };
