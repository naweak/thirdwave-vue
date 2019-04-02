<template>
  <div id="reportsList">
    <table>
      <thead>
        <tr>
          <td>ID</td>
          <td>Тип</td>
          <td>ID контента</td>
          <td>Кто зарепортил</td>
          <td>Причина</td>
          <td>Время</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="report in reports">
          <td>{{ report.id }}</td>
          <td>{{ report['content_type'] }}</td>
          <td>{{ report['content_id'] }}</td>
          <td>{{ report.user }}</td>
          <td v-html="report.reason"></td>
          <td>{{ dateFormat(Number(report.date) * 1000, $root.config.date) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: "reports",
    props: [ 'reports' ]
  }
</script>

<style scoped>
  thead {
    font-weight: bold;
  }
  #reportsList > table > thead > tr > td,
  #reportsList > table > tbody > tr > td {
    padding: 5px;
  }
</style>
