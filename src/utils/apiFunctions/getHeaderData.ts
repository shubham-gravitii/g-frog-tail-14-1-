import {headers} from 'next/headers';
export const getHeaderData=()=>{
    const headersList = headers();
  
    return JSON.parse(headersList.get('userData') || '');
}
