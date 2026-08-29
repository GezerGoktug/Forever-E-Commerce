import type { IResponse } from "@forever/api";
import api from "@/utils/api";
import type { IAdminStatResponse } from "@/types/admin.type";

const getAdminStatistics = (): Promise<IResponse<IAdminStatResponse>> => api.get("/admin/stats");

const AdminService = {
    getAdminStatistics
}

export default AdminService;