import type { Request, Response } from "express";
import logger from "../utils/logger.js";
import supabase from "../Services/supabaseClient.js";

export async function CreateOffice(req: Request, res: Response) {
  try {
    const { name, owner_id } = req.body;
    const { data: office } = await supabase
      .from("offices")
      .select("*")
      .eq("owner_id", owner_id)
      .single();
    if (office)
      return res
        .status(403)
        .json({ success: false, message: "You already have office" });
    const { data, error } = await supabase
      .from("offices")
      .insert({ name, owner_id })
      .select()
      .single();

    if (error) return res.status(400).json({ success: false });
    else return res.status(200).json({ success: true, data });
  } catch (err: any) {
    logger.error(`[Office Create] : ${err.message}`);
  }
}
