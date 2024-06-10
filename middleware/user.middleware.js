import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const getUsersMiddleware = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("flowchartData")
      .select("id,name,connection_text,successors")
      .order("id", { ascending: true });

    if (!error) {
      req.locals = Object.values(data);
      next();
    } else {
      next({ error: error });
    }
  } catch (error) {
   next({ error: error });
  }
};

const getUserMiddleware = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("flowchartData")
      .select("id,name,connection_text,successors")
      .eq("id", req.params?.id)
      .limit(1)
      .single();

    if (!error) {
      req.locals = data;
      next();
    } else {
      next({ error: error });
    }
  } catch (error) {
   next({ error: error });
  }
};

const createMultipleUserMiddleware = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("flowchartData")
      .insert([...req.body])
      .select();

    if (!error) {
      req.locals = data;
      next();
    } else {
      next({ error: error });
    }
  } catch (error) {
   next({ error: error });
  }
};

const createUserMiddleware = async (req, res, next) => {
  try {
    if (req.body?.transferChilds) {
      const { data: predecessorData, error: predecessorError } = await supabase
        .from("flowchartData")
        .select("successors")
        .eq("id", req.body?.predecessor)
        .limit(1)
        .single();

      const { data, error } = await supabase
        .from("flowchartData")
        .insert([
          { name: req.body?.name, successors: predecessorData.successors },
        ])
        .select()
        .single();

      const { error: updatedError } = await supabase
        .from("flowchartData")
        .update({ successors: [data?.id] })
        .eq("id", req.body?.predecessor);

      if (!error && !predecessorError && !updatedError) {
        req.locals = data;
        next();
      } else {
        next({ error: error || predecessorError || updatedError });
      }
    } else {
      const { data, error } = await supabase
        .from("flowchartData")
        .insert([{ name: req.body?.name, successors: req.body?.successors }])
        .select()
        .single();

      const { data: predecessorData, error: predecessorError } = await supabase
        .from("flowchartData")
        .select("successors")
        .eq("id", req.body?.predecessor)
        .limit(1)
        .single();

      const { error: updatedError } = await supabase
        .from("flowchartData")
        .update({ successors: [...predecessorData.successors, data?.id] })
        .eq("id", req.body?.predecessor);

      if (!error && !predecessorError && !updatedError) {
        req.locals = data;
        next();
      } else {
        next({ error: error || predecessorError || updatedError });
      }
    }
    next();
  } catch (error) {
   next({ error: error });
  }
};

const updateUserMiddleware = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("flowchartData")
      .update({ name: req.body?.name })
      .eq("id", req.params?.id)
      .select();

    if (!error) {
      req.locals = data;
      next();
    } else {
      next({ error: error });
    }
  } catch (error) {
   next({ error: error });
  }
};

const deleteUserMiddleware = async (req, res, next) => {
  try {
    const { data: deleteNodeSuccessors, error: deleteNodeError } =
      await supabase
        .from("flowchartData")
        .select("successors")
        .eq("id", req.params?.id)
        .limit(1)
        .single();

    if (deleteNodeError) {
      next({ error: deleteNodeError });
    }

    const { data: predecessorData, error: predecessorError } = await supabase
      .from("flowchartData")
      .select("*")
      .overlaps("successors", [req.params?.id])
      .single();

    if (predecessorError) {
      next({ error: predecessorError });
    }

    const updatedPredecessorSuccessors = [
      ...predecessorData?.successors.filter(
        (child) => +child !== +req.params?.id
      ),
    ];

    const { error: updatedError } = await supabase
      .from("flowchartData")
      .update({
        ...predecessorData,
        successors: [
          ...updatedPredecessorSuccessors,
          ...deleteNodeSuccessors?.successors,
        ],
      })
      .eq("id", predecessorData.id);

    if (updatedError) {
      next({ error: updatedError });
    }

    const { error } = await supabase
      .from("flowchartData")
      .delete()
      .eq("id", req.params?.id);

    if (!error) {
      next();
    } else {
      next({ error: error });
    }
  } catch (error) {
   next({ error: error });
  }
};

export {
  getUsersMiddleware,
  getUserMiddleware,
  createUserMiddleware,
  createMultipleUserMiddleware,
  updateUserMiddleware,
  deleteUserMiddleware,
};
