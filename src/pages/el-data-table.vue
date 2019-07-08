<template>
  <el-data-table v-bind="$data">
    <!-- 模板的自定义按钮没有 slot-scope 传出来，目前只能配置中配置的自定义按钮获取当前行数据 -->
    <!-- 有空再提个 pr 吧 -->
    <template slot="default">
      <el-table-column label="操作">
        <el-button size="small" type="primary" @click="check(scope)"
          >查看</el-button
        >
        <el-button size="small">编辑</el-button>
        <el-button size="small">下架</el-button>
      </el-table-column>
    </template>
  </el-data-table>
</template>
<script>
import dayjs from 'dayjs'
export default {
  data() {
    return {
      hasOperation: false,
      url: '/api/list',
      columns: [
        {type: 'selection'},
        {prop: 'componentName', label: '组件名称'},
        {prop: 'category', label: '分类'},
        {prop: 'version', label: '版本'},
        {prop: 'language', label: '开发语言'},
        {
          prop: 'updatedAt',
          label: '最后更新日期',
          formatter: row => {
            return dayjs.unix(row.updatedAt).format('YYYY-MM-DD')
          }
        },
        {
          prop: 'status',
          label: '状态',
          formatter: row =>
            row.status === 1 ? (
              <span style="color: #00bfff;">上架</span>
            ) : (
              '下架'
            )
        }
      ],
      searchForm: [
        {
          $el: {placeholder: '请输入'},
          label: '组件名称',
          $id: 'name',
          $type: 'input'
        },
        {
          $el: {placeholder: '请选择'},
          label: '分类',
          $id: 'category',
          $type: 'select',
          $options: [
            {label: '分类0', value: 0},
            {label: '分类1', value: 1},
            {label: '分类2', value: 2},
            {label: '分类3', value: 3}
          ]
        },
        {
          $el: {placeholder: '请选择'},
          label: '状态',
          $id: 'status',
          $type: 'select',
          $options: [{label: '下架', value: 0}, {label: '上架', value: 1}]
        }
      ]
    }
  },
  methods: {
    check(...row) {
      console.log(row)
    }
  }
}
</script>
