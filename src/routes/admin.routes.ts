import { AnswerVerificationRequest, GetAllVerificationRequests, GetLawyerCardUrl } from "../Controllers/admin.controller.js"
import adminOnly from "../middlewares/adminOnly.js"
import verifyToken from "../middlewares/verifyToken.js"
import Router from "express"

 const router = Router()

router.get("/verification_requests",verifyToken,adminOnly,GetAllVerificationRequests);
router.get("/verification_requests/:requestId",verifyToken,adminOnly,GetLawyerCardUrl);
router.post("/verification_requests/:requestId",verifyToken,adminOnly,AnswerVerificationRequest);
export default router;

