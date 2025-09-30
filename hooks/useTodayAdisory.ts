import { StorageContext } from "@/Context/StorageContext";
import { useContext, useEffect, useState } from "react";
import { useKrishiAI } from "./useKrishiAI";

export const useTodayAdisory = () => {
    const {currentMessage,handleSendMessage}  = useKrishiAI();
    const storageContext   = useContext(StorageContext)
    const {userBasicInfo} = storageContext;
    const [Advisory, setAdvisory] = useState("Rain expected tonight. Cover fertilizer bags and avoid field work tomorrow morning.")
    const [loading, setLoading] = useState(false);
    // const [isDeviceOnline, setIsDeviceOnline] = useState(navigator.onLine);

    const fetchAdvisory=async()=>{
        // if(!isDeviceOnline) return;
    
        try{    
            console.log("Starting to give the today's adivce ");
            
            setLoading(true);
             // console.log(`Provide a short advisory for today based on the weather forecast. The advisory should be concise and actionable for farmers. Details are ${JSON.stringify(userBasicInfo)} the size of land is in acres  `);
            // await handleSendMessage(`Provide a short advisory for today based on the weather forecast. The advisory should be concise and actionable for farmers. Details are ${JSON.stringify(userBasicInfo)} the size of land is in acres  `)
          
           if(!currentMessage) return ;
            setAdvisory(currentMessage)
            console.log("the today's advisory is "+currentMessage);
            
        }
        catch(e)
        {
            console.log("error fetching the Adviosy in dashboard in useTodayAdvisory"+e);
        }
        finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchAdvisory();
    },[])
    return {Advisory,loading};
}
