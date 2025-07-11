const prisma = require("../utils/prisma");
const { Folder } = require("./folder");

const FolderUser = {
  // 创建新记录
  async create(data) {
    return await prisma.folder_users.create({ data });
  },

  createManyUsers: async function (userIds = [], folderId) {
    if (userIds.length === 0) return;
    try {
      await prisma.$transaction(
        userIds.map((userId) =>
          prisma.folder_users.create({
            data: {
              user_id: Number(userId),
              folder_id: Number(folderId),
            },
          })
        )
      );
    } catch (error) {
      console.error(error.message);
    }
    return;
  },

  delete: async function (clause = {}) {
    try {
      await prisma.folder_users.deleteMany({ where: clause });
    } catch (error) {
      console.error(error.message);
    }
    return;
  },

  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const results = await prisma.folder_users.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return results;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  // 查询所有记录
  async findAll(where = {}) {
    return await prisma.folder_users.findMany({ where });
  },

  // 查询单条记录
  async findOne(where) {
    return await prisma.folder_users.findFirst({ where });
  },

  // 更新记录
  async update(id, data) {
    return await prisma.folder_users.update({
      where: { id },
      data,
    });
  },

  // 删除记录
  async remove(id) {
    return await prisma.folder_users.delete({
      where: { id },
    });
  },
  
  async removeManyByFolderID(folderId) {
    return await prisma.folder_users.deleteMany({
      where: { folder_id: folderId },
    });
  },

  async findByUserId(userId) {
    return await prisma.folder_users.findMany({
      where: { user_id: userId },
    });
  },

  async findByFolderId(folderId) {
    return await prisma.folder_users.findMany({
      where: { folder_id: folderId },
    });
  },
};

module.exports = { FolderUser };