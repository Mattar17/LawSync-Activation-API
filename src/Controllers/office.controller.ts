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

    console.log(data);

    if (error) return res.status(400).json({ success: false });
    else {
      const { error } = await supabase
        .from("office_members")
        .insert({ office_id: data.id, lawyer_id: owner_id });
      console.log(error?.message);
      return res.status(200).json({ success: true, data });
    }
  } catch (err: any) {
    logger.error(`[Office Create] : ${err.message}`);
  }
}

export async function getOfficesData(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("office_members")
      .select("*,offices(id,name)")
      .eq("lawyer_id", id);
    if (error) {
      logger.error(error.message);
      return res.json(error);
    }
    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    logger.error(`[Offices fetch] : ${err.message}`);
    return res
      .status(500)
      .json({ success: false, message: `Server Error ${err.message}` });
  }
}
