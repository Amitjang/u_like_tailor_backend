/**
 * @swagger
 * tags:
 *   name: Workers
 *   description: Worker Management APIs
 */

/**
 * @swagger
 * /api/workers/getWorkers:
 *   get:
 *     summary: Get all workers
 *     tags: [Workers]
 *     responses:
 *       200:
 *         description: Workers fetched successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/workers/summary/cards:
 *   get:
 *     summary: Get worker summary cards
 *     tags: [Workers]
 *     responses:
 *       200:
 *         description: Worker summary fetched successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/workers/createWorker:
 *   post:
 *     summary: Create a new worker
 *     tags: [Workers]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - specialization
 *             properties:
 *               name:
 *                 type: string
 *                 example: Raj Kumar
 *               nameHi:
 *                 type: string
 *                 example: राज कुमार
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               specialization:
 *                 type: string
 *                 example: Tailor
 *               specializationHi:
 *                 type: string
 *                 example: दर्जी
 *               avatarColor:
 *                 type: string
 *                 example: "#1565C0"
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Worker created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/workers/updateWorker/{workerId}:
 *   patch:
 *     summary: Update worker
 *     tags: [Workers]
 *     parameters:
 *       - in: path
 *         name: workerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Worker MongoDB ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               nameHi:
 *                 type: string
 *               phone:
 *                 type: string
 *               specialization:
 *                 type: string
 *               specializationHi:
 *                 type: string
 *               avatarColor:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum:
 *                   - free
 *                   - active
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Worker updated successfully
 *       404:
 *         description: Worker not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/workers/toggle-status/{workerId}:
 *   patch:
 *     summary: Toggle worker status
 *     tags: [Workers]
 *     parameters:
 *       - in: path
 *         name: workerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Worker MongoDB ID
 *     responses:
 *       200:
 *         description: Worker status updated successfully
 *       404:
 *         description: Worker not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/workers/deleteWorker/{workerId}:
 *   delete:
 *     summary: Delete worker
 *     tags: [Workers]
 *     parameters:
 *       - in: path
 *         name: workerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Worker MongoDB ID
 *     responses:
 *       200:
 *         description: Worker deleted successfully
 *       400:
 *         description: Cannot delete worker with assigned orders
 *       404:
 *         description: Worker not found
 *       500:
 *         description: Internal server error
 */