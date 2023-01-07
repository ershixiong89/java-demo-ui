<template>
  <div class="app-container">
    <el-card shadow="hover" class="qa-card">
      <div slot="header">
        <div class="qa-card-title">
          <h2>User List</h2>
        </div>
        <div class="qa-card-operation">
          <el-button-group>
            <el-button
              size="mini"
              round
              type="primary"
              @click="onCreateUser"
            >
              <svg-icon icon-class="create-simple" style="margin-right: 8px"/>
              <span>Add A New User</span>
            </el-button>
            <el-button
              size="mini"
              round
              type="primary"
              icon="el-icon-refresh"
              @click="fetchAll"
            >
              <span>Refresh</span>
            </el-button>
          </el-button-group>
        </div>
      </div>
    </el-card>
    <el-card shadow="hover" class="qa-card" style="margin-top: 20px">
      <el-table
        v-loading="loading"
        :element-loading-text="loadingText"
        :data="userList"
        stripe
        border
        highlight-current-row
        size="small"
        class="qa-table"
      >
        <el-table-column label="Name" min-width="120px">
          <template slot-scope="scope">
            <div class="avatar-item">
              <el-avatar :src="getAvatar(scope.row.avatar)" :key="scope.row.avatar"></el-avatar>
              <!-- <i class="el-icon-user" /> -->
              <span>{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Description" show-overflow-tooltip min-width="180px">
          <template slot-scope="scope">
            <div class="list-item">
              <span>{{ scope.row.description }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Created At" min-width="160px">
          <template slot-scope="scope">
            <div class="list-item">
              <i class="el-icon-time" /><span>{{ scope.row.createAt }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Update At" min-width="160px">
          <template slot-scope="scope">
            <div class="list-item">
              <i class="el-icon-time" /><span>{{ scope.row.createAt }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="180px">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                size="mini"
                round
                plain
                type="primary"
                icon="el-icon-edit"
                @click="onUpdateUser(scope.row)"
              >
                <span>Edit</span>
              </el-button>
              <el-button
                size="mini"
                round
                plain
                type="danger"
                icon="el-icon-delete"
                @click="onDeleteUser(scope.row)"
              >
                <span>Delete</span>
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>      
    </el-card>

    <Pagination
      v-show="totalCount > 0"
      :total="totalCount"
      :page.sync="pageNum"
      :limit.sync="pageSize"
      class="qa-pagination"
      @pagination="fetchAll()"
    />

    <UserEditDrawer ref="userEditDrawerRef" @update="fetchAll" />
  </div>
</template>

<script>
import { getUserList, deleteUser } from '@/api/java-demo/db'
import Pagination from "@/components/Pagination"
import UserEditDrawer from './components/user-edit-drawer.vue'

export default {
  components: { Pagination, UserEditDrawer },
  data() {
    return {
      loading: '',
      loadingText: '',

      pageNum: 1,
      pageSize: 10,
      totalCount: 0,

      userList: []
    }
  },
  created() {
    this.fetchAll()
  },
  methods: {
    fetchAll() {
      const queryData = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.userList.splice(0, this.userList.length)
      this.loading = true
      this.loadingText = 'loading user list...'
      getUserList(queryData).then(res => {
        this.loading = false
        this.userList = res.data.records
        this.totalCount = res.data.total
      }).catch(() => {
        this.loading = false
      })
    },
    getAvatar(avatar) {
      return `${process.env.VUE_APP_JAVA_DEMO_BASE_URL}/api/v1/file/get?fileName=${avatar}`
    },
    onCreateUser() {
      this.$refs['userEditDrawerRef'].onDrawerInit(true)
    },
    onUpdateUser(data) {
      this.$refs['userEditDrawerRef'].onDrawerInit(false, data)
    },
    onDeleteUser(data) {
      console.log('>>>>>data: %O', data)
      var tipTitle = `Are you sure to <span style="font-weight:bold;color: #F56C6C">DELETE</span> this user ?`
      this.$confirm(tipTitle, 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        // update/create user
        this.loading = true
        this.loadingText = `deleting....`

        const deleteData = {
          includeUserIdList: [ data.id ]
        }
        deleteUser(deleteData).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.$message.success('delete succeed')
            this.fetchAll()
          }
          else {
            this.$message.warning(res.message)
          }
        }).catch(() => {
          this.loading = false
        })
      })    
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/qa-table.scss";
@import "@/styles/qa-card.scss";
@import "@/styles/mixin.scss";


</style>