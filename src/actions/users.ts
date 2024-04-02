import UserModel from "@/models/UserModel";
import { currentUser } from "@clerk/nextjs";
export const handleNewUserRegistration = async () => {
  try {
    const currentUserData = await currentUser();
    const clerkUserId = currentUserData?.id;
    const user = await UserModel.findOne({ clerkUserId });
    if (user) {
      return;
    } else {
      const newUser = new UserModel({
        name: currentUserData?.username || `${currentUserData?.firstName}`,
        email: currentUserData?.emailAddresses[0].emailAddress,
        clerkUserId,
        profilePicUrl: currentUserData?.imageUrl,
      });
      await newUser.save();
    }
  } catch (error) {}
};

export const getMongoDbUserIdFromClerkUserId = async (clerkUserId: string) => {
  try {
    const user = await UserModel.findOne({ clerkUserId });
    if (!user) {
      throw new Error("User not found");
    }
    return user._id;
  } catch (error) {
    console.log(error);
  }
};
