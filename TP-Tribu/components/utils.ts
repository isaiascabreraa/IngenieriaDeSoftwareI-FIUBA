import { backHost } from "@/types/types";

export function convertDateYYYYMMDDtoMMDDYYYY(date: string) {
    const parts = date.split("-");
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    return `${month}/${day}/${year}`;
}

export function convertDateToYYYYMMDD(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero for single-digit days
    return `${year}-${month}-${day}`;
}

export const mapAllObjectsByID = (list: any[], key: string, objects: any[]) => {
    return list.map((item) => ({ ...item, [key]: objects.find((o) => o["id"] === item[key]) }));
}

export function parseAllDates(list: any[], keys: string[]): any[] {
    keys.map(key => {
        list.map(item => {
            if (item[key] == undefined) {
                return;
            }
            item[key] = convertDateYYYYMMDDtoMMDDYYYY(item[key])
        })
    }
    )

    return list;
}

export function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export function convertDateMMDDYYYYToDDMMYYYY(dateString: string) {
    if (dateString == null) {
        return null;
    }

    const parts = dateString.split("/");
    const month = parts[0];
    const day = parts[1];
    const year = parts[2];
    return `${day}/${month}/${year}`;
}