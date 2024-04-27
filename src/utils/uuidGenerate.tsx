import { v4 as uuidv4 } from 'uuid';


export function UniqueID(strVal) {

    var uidv4 = uuidv4();
    // console.log(uidv4);
    var uid = uidv4.replace(/[-\s]/g, "");
    //var uid = uidv4.toString().split('-').join('');

    var tweaked_id = ""
    var chaactersLength = uid.length;

    for (var i = 0; i < 7; i++) {
        tweaked_id += uid.charAt(Math.floor(Math.random() * chaactersLength));
    }

    if (strVal == "Broker") {
        tweaked_id = "GL-" + tweaked_id;
    } else if (strVal == "Carrier") {
        tweaked_id = "GM-" + tweaked_id;
    } else if (strVal == "Owner") {
        tweaked_id = "GWO-" + tweaked_id;
    } else if (strVal === "Customer") {
        tweaked_id = "GCI-" + tweaked_id;
    } else if (strVal === "WhId") {
        tweaked_id = "GWH-" + tweaked_id;
    } else if (strVal === "RentalId") {
        tweaked_id = "GWR-" + tweaked_id;
    }
    else if (strVal === "PostId") {
        tweaked_id = "GWC-" + tweaked_id;
    }

    return tweaked_id;
}