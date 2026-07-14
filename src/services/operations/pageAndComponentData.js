// import React from 'react'
import { toast } from "react-toastify"
import { apiConnector } from '../apiconnector';
import { catalogData } from '../apis';
import { Spinner } from '../../components/Common/Spinner';
export const getCatalogaPageData = async(categoryId) => {
 Spinner("show");
  let result = [];
  try{
        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API, 
        {categoryId: categoryId,});

        if(!response?.data?.success)
            throw new Error("Could not Fetch Category page data");

         result = response?.data;

  }
  catch(error) {
    console.log("CATALOG PAGE DATA API ERROR....", error);
    toast.error(error.message);
    result = error.response?.data;
  }
  Spinner("hide");
  return result;
}

