import type { Request, Response } from "express";
import logger from "../utils/logger.js";
import supabase from "../Services/supabaseClient.js";

interface AuthRequest extends Request {
  token?: {
    admin?: boolean;
    lawyer_token?: string;
    lawyer_id?: string;
  };
}

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
      .select("*,offices(id,owner_id,name)")
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

// GET /api/offices/:id
export const getOfficeById = async (req: Request, res: Response) => {
  const { id } = req.params;

  logger.info(`Fetching office. OfficeId=${id}`);

  try {
    const { data, error } = await supabase
      .from("offices")
      .select("id, owner_id, name, address, phone, description")
      .eq("id", id)
      .single();

    if (error) {
      logger.error(
        `Failed to fetch office. OfficeId=${id}. Error=${error.message}`,
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch office.",
      });
    }

    if (!data) {
      logger.warn(`Office not found. OfficeId=${id}`);

      return res.status(404).json({
        success: false,
        message: "Office not found.",
      });
    }

    logger.info(`Office fetched successfully. OfficeId=${id}`);

    return res.status(200).json({
      success: true,
      office: data,
    });
  } catch (err) {
    logger.error(`Unexpected error while fetching office. OfficeId=${id}`, err);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// PUT /api/offices/:id
export const updateOffice = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const {
    name,
    address,
    phone,
    description,
  }: {
    name: string;
    address?: string;
    phone?: string;
    description?: string;
  } = req.body;

  logger.info(`Updating office. OfficeId=${id}`);

  try {
    const updateData = {
      name,
      address: address ?? null,
      phone: phone ?? null,
      description: description ?? null,
    };

    const { data, error } = await supabase
      .from("offices")
      .update(updateData)
      .eq("id", id)
      .select("id, owner_id, name, address, phone, description")
      .single();

    if (error) {
      logger.error(
        `Failed to update office. OfficeId=${id}. Error=${error.message}`,
      );

      return res.status(500).json({
        success: false,
        message: "Failed to update office.",
      });
    }

    if (!data) {
      logger.warn(`Office not found for update. OfficeId=${id}`);

      return res.status(404).json({
        success: false,
        message: "Office not found.",
      });
    }

    if (req.token?.lawyer_id != data.owner_id) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You're not allowed to edit this data",
        });
    }

    logger.info(`Office updated successfully. OfficeId=${id}`);

    return res.status(200).json({
      success: true,
      message: "Office updated successfully.",
      office: data,
    });
  } catch (err) {
    logger.error(`Unexpected error while updating office. OfficeId=${id}`, err);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
