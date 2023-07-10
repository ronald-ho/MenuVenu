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
    const response = [];
    for (const table in data.table_list) {
        const body = {
            table_id: data.table_list[table].table_id,
            table_number: data.table_list[table].table_number,
            is_occupied: false
        }

        if (data.occupied_list.includes(data.table_list[table].table_number)) {
            body['is_occupied'] = true
        }
        response.push(body)
    }
    return response;
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
        console.log(response.customer_info);
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
        return "Invalid email";
    }
    if (!data.password) {

    } else if (!/[0-9]/.test(data.password) || !/\w/.test(data.password) || !/\W/.test(data.password) ) {
        return "New password needs at least one letter, number and special character";
    }
    /* replace with fetch and post data */
    const body = {
        customer_id: localStorage.getItem("mvuser"),
        new_email: data.email,
        new_full_name: data.name,
        new_password: data.password
    }
    const response = await apiCall("auth/update", "PUT", body);
    if (response.status == 400) {
        return "Email already exists"
    }
    return "Success!";
}

export const get_categories = async () => {
    /*api call */
    const body = [
        {
            name: "Kebab",
            category_id: 1
        }, {
            name: "Seafood",
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
            name: "HSP",
            image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Hspchips_%28cropped%29.jpg",
            price: 16.50,
            calories: 485,
            points: 100
        }, {
            item_id: 2,
            name: "Chicken roll",
            image: "https://www.recipetineats.com/wp-content/uploads/2017/11/Chicken-Doner-Kebab-2.jpg",
            price: 13.50,
            calories: 500,
            points: 70
        }
    ]
    const body2=[
        {
            item_id: 3,
            name: "Seafood basket",
            image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Hspchips_%28cropped%29.jpg",
            price: 15.00,
            points: 80
        }, {
            item_id: 4,
            name: "Fish n chips",
            image: "https://www.daringgourmet.com/wp-content/uploads/2019/08/Fish-and-Chips-1-square-500x375.jpg",
            price: 14.00
        }
    ]
    if (params.categoryid == 1) {
        return body;
    } else {
        return body2;
    }
}

export async function get_item(params) {
    console.log(params.itemid);
    return {
        item_id: 3,
        name: "Seafood basket",
        image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Hspchips_%28cropped%29.jpg",
        price: 15.00,
        points: 80,
        description: 'shidma fartma ballsma'
    }
}