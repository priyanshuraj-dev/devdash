import { Request, Response } from "express";
import User from "../../models/user.models.js";
import { deleteFromCloudinary } from "../../config/cloudinary.js";

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    
    const {
      leetcodeHandle,
      codeforcesHandle,
      codechefHandle,
      githubHandle,
      avatar,
    } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    if (avatar) {
      // If user already has an avatar, delete old one
      if (user?.avatar?.publicId) {
        
        await deleteFromCloudinary(user.avatar.publicId);
      }
      user.avatar = avatar;
    }

    // Update handles only if provided
    if (leetcodeHandle !== undefined) user.leetcodeHandle = leetcodeHandle;
    if (codeforcesHandle !== undefined) user.codeforcesHandle = codeforcesHandle;
    if (codechefHandle !== undefined) user.codechefHandle = codechefHandle;
    if (githubHandle !== undefined) user.githubHandle = githubHandle;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        username: user.username,
        email: user.email,
        leetcodeHandle: user.leetcodeHandle,
        codeforcesHandle: user.codeforcesHandle,
        codechefHandle: user.codechefHandle,
        githubHandle: user.githubHandle,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    return res.status(500).json({
      message: "Profile update failed",
    });
  }
};
