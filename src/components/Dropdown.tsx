"use client";
import { FaRegFolderOpen } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DropdownComponent({
  folders,
  onSelectFolder,
  onSelectFolderID,
}: {
  folders: any;
  onSelectFolder: (folder: string) => void;
  onSelectFolderID: (folder: string) => void;
}) {
  console.log("{FROM DROPDOWN COMOINENT}:", folders);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-emerald-400/60 hover:bg-emerald-400/80">
          <FaRegFolderOpen />
          Select Folder
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Create sheet in:</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {folders.map((folder:any, index:number) => (
            <div key={index}>
              <DropdownMenuItem
                onSelect={() => {
                  console.log("Selected:", folder.name);
                  onSelectFolder(folder.name);
                  onSelectFolderID(folder.id);
                }}
              >
                {folder.name}
              </DropdownMenuItem>
            </div>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
