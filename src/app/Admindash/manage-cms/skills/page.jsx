"use client";

import { CREATE_SKILL, DELETE_SKILL, GET_SKILLS, UPDATE_SKILL, UPDATE_SKILL_STATUS } from "@/app/graphQL/astroHiring";
import MasterManager from "../masterPage";
import MasterDrawer from "../masterDrawer";

export default function Page(){

return(

<MasterManager
  title="Skills"
  Drawer={MasterDrawer}
  GET_ITEMS={GET_SKILLS}
  CREATE_ITEM={CREATE_SKILL}
  UPDATE_ITEM={UPDATE_SKILL}
  DELETE_ITEM={DELETE_SKILL}
  UPDATE_STATUS={UPDATE_SKILL_STATUS}
/>

)

}