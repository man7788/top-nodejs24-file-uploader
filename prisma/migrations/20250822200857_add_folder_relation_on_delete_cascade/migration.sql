-- DropForeignKey
ALTER TABLE "public"."Folder" DROP CONSTRAINT "Folder_superFolderId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Folder" ADD CONSTRAINT "Folder_superFolderId_fkey" FOREIGN KEY ("superFolderId") REFERENCES "public"."Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
