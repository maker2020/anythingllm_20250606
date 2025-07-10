const prisma = require("../utils/prisma");

const FileSystem = {
  // 创建新记录
  async create(data) {
    return await prisma.filesystem.create({ data });
  },

  // 查询所有记录
  async findAll(where = {}) {
    return await prisma.filesystem.findMany({ where });
  },

  // 查询单条记录
  async findOne(where) {
    return await prisma.filesystem.findFirst({ where });
  },

  // 更新记录
  async update(id, data) {
    return await prisma.filesystem.update({
      where: { id },
      data,
    });
  },

  // 删除记录
  async remove(id) {
    return await prisma.filesystem.delete({
      where: { id },
    });
  },

  async findByUserId(userId) {
    return await prisma.filesystem.findMany({
      where: { createdby_userid: userId },
    });
  },
};

module.exports = { FileSystem };