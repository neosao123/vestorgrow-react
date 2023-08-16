import util from "../util/util";
import axios from "axios"
export default class CourseService {
    async courseList(data) {
        try {
            const course = Object.keys(data).reduce((object, key) => {
                if (data[key] !== "") {
                    object[key] = data[key];
                }
                return object;
            }, {});
            return await util.sendApiRequest("/course/list", "POST", true, course);
        } catch (err) {
            throw err;
        }
    }

    async getCourse(courseId) {
        try {
            return await util.sendApiRequest("/course/" + courseId, "GET", true);
        } catch (err) {
            throw err;
        }
    }
    async webinarList(data) {
        try {
            const course = Object.keys(data).reduce((object, key) => {
                if (data[key] !== "") {
                    object[key] = data[key];
                }
                return object;
            }, {});
            return await util.sendApiRequest("/webinar/list", "POST", true, course);
        } catch (err) {
            throw err;
        }
    }
    async learningMaterialList(data) {
        try {
            const course = Object.keys(data).reduce((object, key) => {
                if (data[key] !== "") {
                    object[key] = data[key];
                }
                return object;
            }, {});
            return await util.sendApiRequest("/learningmaterial/list", "POST", true, course);
        } catch (err) {
            throw err;
        }
    }

    async getLearningMaterial(id) {
        try {
            return await util.sendApiRequest("/learningmaterial/" + id, "GET", true);
        } catch (err) {
            throw err;
        }
    }
    async getLearningMaterialPdf(id) {
        try {
            return await util.sendApiRequest("/learningmaterial/getpdf/" + id, "GET", true);
        } catch (err) {
            throw err;
        }
    }
}