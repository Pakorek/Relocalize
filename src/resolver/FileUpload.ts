import { Resolver, Mutation, Arg, Ctx, Authorized } from "type-graphql";
import GraphQLUpload from "graphql-upload";
import cloudinary from "cloudinary";
import { Upload } from "../entity/Upload";
import dotenv from "dotenv";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

dotenv.config();

export type FileType = {
  asset_id: string,
  public_id: string,
  version: BigInteger,
  version_id: string,
  signature: string,
  width: number,
  height: number,
  format: string,
  resource_type: string,
  created_at: string,
  tags: string[],
  bytes: number,
  type: string,
  etag: string,
  placeholder: boolean,
  url: string,
  secure_url: string,
  original_filename: string,
  api_key: string
}

@Resolver(Upload)
export class FileUploadResolver {
  private userRepo = getRepository(User);

  // @Authorized()
  // @Mutation(() => Boolean)
  // async uploadFile(
  //   @Arg("file", () => GraphQLUpload) file: Upload,
  //   @Ctx() ctx
  // ): Promise<boolean> {
  //   // check MIME ( here ? )
  //   return new Promise(async (resolve, reject) => {
  //     const uploadedFile: string = await uploadFile(file);
  //     console.log("uploadedFile", uploadedFile);
  //     if (uploadedFile) {
  //       // link to user
  //       console.log("context", ctx.user);
  //       await this.userRepo.update(ctx.user.id, { avatar: uploadedFile });
  //     }
  //     resolve(true);
  //   });
  // }
}

const uploadFile = async (file): Promise<string> => {
  const { createReadStream } = await file;
  const fileStream = createReadStream();

  // Initiate Cloudinary with your credentials
  cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });

  return new Promise((resolve, reject) => {

    const cloudStream = cloudinary.v2.uploader.upload_stream(function(err, fileUploaded) {
      if (err || !fileUploaded) {
        reject(JSON.stringify(err));
      }
      // compress & other with Sharp
      if (fileUploaded) resolve(fileUploaded.secure_url);
    });
    fileStream.pipe(cloudStream);
  });
};

