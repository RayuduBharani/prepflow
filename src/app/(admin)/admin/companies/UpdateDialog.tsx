import { updateCompanyImage } from "@/app/actions/adminActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ImagePlus } from "lucide-react";
import Form from "next/form";
import Image from "next/image";

const UpdateDialog = ({
  name,
  image,
}: {
  name: string;
  image: string | null;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"} className="text-xs" variant={"outline"}>
          <ImagePlus className="text-primary" /> Update
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update the <span className="text-primary">{name}</span> Image ?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
          <Form
            className="flex border items-center rounded-md p-2 flex-1 w-full gap-2"
            action={updateCompanyImage}
          >
            <Image
              className="w-24 h-24 rounded-full"
              alt={name}
              width={50}
              height={50}
              src={image ?? "/placeholder.png"}
            />
            <div className="w-full gap-2 items-start flex flex-col">
              <p className="text-sm text-muted-foreground font-semibold">Image URL</p>
              <input name="company" readOnly value={name} className="hidden sr-only" />
              <Input
                className=" placeholder:text-sm"
                placeholder="Enter the image URL"
                defaultValue={image ?? ""}
                name="imageUrl"
              />
              <div className="w-full flex flex-1 gap-2">
                <Button size={"sm"} className="text-xs" type="submit">
                  <ImagePlus /> Update Image
                </Button>
                <DialogClose asChild>
                  <Button className="text-xs" variant={"secondary"} size={"sm"}>
                    Cancel
                  </Button>
                </DialogClose>
              </div>
            </div>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDialog;
