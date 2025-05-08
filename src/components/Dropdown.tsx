"use client";
import { FaRegFolderOpen } from "react-icons/fa6";
import { SiGooglesheets } from "react-icons/si";

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
  type,
  data,
  onSelectItem,
  onSelectItemID,
}: {
  type: "folder" | "sheet";
  data: any;
  onSelectItem: (data: string) => void;
  onSelectItemID: (data: string) => void;
}) {
  // console.log("{FROM DROPDOWN COMPONENT}:", data);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-emerald-400/60 hover:bg-emerald-400/80">
          {type==="folder" ? <FaRegFolderOpen /> : <SiGooglesheets/>}
          {type==="folder" ? "Select Folder" : "Select Sheet"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{type==="folder" ? "Create sheet in:" : "Choose sheet:"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {data.map((item:any, index:number) => (
            <div key={index}>
              <DropdownMenuItem
                onSelect={() => {
                  // console.log("Selected:", item.name);
                  onSelectItem(item.name);
                  onSelectItemID(item.id);
                }}
              >
                {item.name}
              </DropdownMenuItem>
            </div>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
