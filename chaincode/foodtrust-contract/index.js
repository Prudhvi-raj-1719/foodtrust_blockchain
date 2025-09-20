"use strict";

const { Contract } = require("fabric-contract-api");

class FoodTrustContract extends Contract {
  async initLedger(ctx) {
    return;
  }

  async createBatch(ctx, batchId, payloadJson) {
    const exists = await this._exists(ctx, batchId);
    if (exists) throw new Error(`Batch ${batchId} already exists`);
    const payload = JSON.parse(payloadJson);
    payload.id = batchId;
    payload.owner = payload.owner || "Farmer";
    payload.status = payload.status || "CREATED";
    payload.history = [{ action: "CREATE", ts: new Date().toISOString() }];
    await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(payload)));
    return JSON.stringify(payload);
  }

  async updateBatch(ctx, batchId, updatesJson) {
    const batch = await this._get(ctx, batchId);
    const updates = JSON.parse(updatesJson);
    const updated = { ...batch, ...updates };
    updated.history = [...(batch.history || []), { action: "UPDATE", ts: new Date().toISOString(), updates }];
    await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(updated)));
    return JSON.stringify(updated);
  }

  async recordSensorData(ctx, batchId, sensorJson) {
    const batch = await this._get(ctx, batchId);
    const sensor = JSON.parse(sensorJson);
    batch.sensorLog = [...(batch.sensorLog || []), { ...sensor, ts: new Date().toISOString() }];
    await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)));
    return JSON.stringify(batch.sensorLog[batch.sensorLog.length - 1]);
  }

  async queryBatchHistory(ctx, batchId) {
    const iterator = await ctx.stub.getHistoryForKey(batchId);
    const history = [];
    while (true) {
      const res = await iterator.next();
      if (res.value && res.value.value) {
        const tx = {
          txId: res.value.tx_id,
          isDelete: res.value.is_delete,
          value: res.value.value.toString("utf8")
        };
        history.push(tx);
      }
      if (res.done) break;
    }
    await iterator.close();
    return JSON.stringify(history);
  }

  async recallBatch(ctx, batchId, reason) {
    const batch = await this._get(ctx, batchId);
    batch.status = "RECALLED";
    batch.recall = { reason, ts: new Date().toISOString() };
    batch.history = [...(batch.history || []), { action: "RECALL", reason, ts: new Date().toISOString() }];
    await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)));
    return JSON.stringify(batch);
  }

  async _exists(ctx, id) {
    const data = await ctx.stub.getState(id);
    return data && data.length > 0;
  }

  async _get(ctx, id) {
    const data = await ctx.stub.getState(id);
    if (!data || data.length === 0) throw new Error(`Asset ${id} does not exist`);
    return JSON.parse(data.toString());
  }
}

module.exports.contracts = [FoodTrustContract];
