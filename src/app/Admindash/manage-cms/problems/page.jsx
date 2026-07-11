"use client";

import { CREATE_PROBLEM, DELETE_PROBLEM, GET_PROBLEMS, UPDATE_PROBLEM, UPDATE_PROBLEM_STATUS } from "@/app/graphQL/astroHiring";
import MasterManager from "../masterPage";
import MasterDrawer from "../masterDrawer";

export default function Page(){

return(

<MasterManager
  title="Problems"
  Drawer={MasterDrawer}
  GET_ITEMS={GET_PROBLEMS}
  CREATE_ITEM={CREATE_PROBLEM}
  UPDATE_ITEM={UPDATE_PROBLEM}
  DELETE_ITEM={DELETE_PROBLEM}
  UPDATE_STATUS={UPDATE_PROBLEM_STATUS}
/>

)

}