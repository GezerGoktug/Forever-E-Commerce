import type { IResponse } from "@forever/api";
import api from "@/utils/api";
import type { AdminStatResponse } from "@/types/admin.type";

const getAdminStatistics = (): Promise<IResponse<AdminStatResponse>> => api.get("/admin/stats");

const AdminService = {
    getAdminStatistics
}

export default AdminService;