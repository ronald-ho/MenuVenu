import { apiCall } from "./helpers";
import { redirect } from "react-router-dom";

async function createGuest () {
    /*do api call here to create a guest and then set token*/
}

export const tabsel_load = async () => {
    console.log('it ran');
    if (!localStorage.getItem('mvuser')) {
        await createGuest();
    }

    /*do api call to get list of tables and return them*/
    const data = await apiCall("orders/get_tables", "GET", {});
    return data.table_list;
}

export const get_profile = async () => {
    /* do api call to get customer details */
    const petergriffin = {
        name: "Peter Griffin",
        email: "petergriffin@pawtucketbrewery.com",
        points: 1000,
        mfp: "Unconnected"
    }
    const response = await apiCall("auth/customer/"+localStorage.getItem("mvuser"), "GET", {});
    if (response.status === 200) {
        return response.customer_info;
    } else {
        return petergriffin;
    }
}

export function redirect_if_logged_in () {
    console.log('it ran');
    if (localStorage.getItem('mvtoken')) {
        console.log(localStorage.getItem('mvtoken'));
        return redirect('/tableselect');
    }
    return null;
}

export async function change_details (request) {
    const data = Object.fromEntries(await request.formData());
    const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!data.email || !data.name || !validEmailRegex.test(data.email)) {
        return false;
    }
    /* replace with fetch and post data */
    const body = {
        customer_id: localStorage.getItem("mvuser"),
        new_email: data.email,
        new_full_name: data.name
    }
    const response = await apiCall("auth/update", "PUT", body);
    return true;
}

export const get_categories = async () => {
    /*api call */
    const body = [
        {
            name: "Drinks",
            category_id: 1
        }, {
            name: "Snacks",
            category_id: 2
        }
    ]
    return body;
}

export async function get_items(params) {
    console.log(params.categoryid);
    /*do fetch */
    const body=[
        {   
            item_id: 1,
            name: "HSP"
        }, {
            item_id: 2,
            name: "Chicken roll"
        }
    ]
    const body2=[
        {
            item_id: 3,
            name: "Seafood bucket"
        }, {
            item_id: 4,
            name: "Fish n chips"
        }
    ]
    if (params.categoryid == 1) {
        return body;
    } else {
        return body2;
    }
}