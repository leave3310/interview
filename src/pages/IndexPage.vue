<script setup lang="ts">
import { QTableProps } from 'quasar';
import { ref, onMounted } from 'vue';

import { getCRUDTest, postCRUDTest,patchCRUDTest,deleteCRUDTest } from '@/api/module/crudTest';
import { useToDoStore } from '@/stores/todo';
import type { BaseCRUDTest } from '@/api/module/crudTest';

interface BtnType {
  label: string;
  icon: string;
  status: string;
}
const toDoStore = useToDoStore();

onMounted(async () => {
  await getCRUDTest();
})

const inputData = ref({
  id:'',
  name: '',
  age: '',
});

enum CreateOrEdit {
  CREATE = 'create',
  EDIT = 'edit',
}
const currentStatus = ref(CreateOrEdit.CREATE);
const createOrEditData = async () => {
  if(currentStatus.value === CreateOrEdit.CREATE){
    const payload = {
      name: inputData.value.name,
      age: Number(inputData.value.age),
    }
    await postCRUDTest(payload);
    await getCRUDTest();
  }else{
    const payload = {
      id: inputData.value.id,
      name: inputData.value.name,
      age: Number(inputData.value.age),
    }
    await patchCRUDTest(payload);
    await getCRUDTest();
    currentStatus.value = CreateOrEdit.CREATE;
  }
}

const tableConfig = ref([
  {
    label: '姓名',
    name: 'name',
    field: 'name',
    align: 'left',
  },
  {
    label: '年齡',
    name: 'age',
    field: 'age',
    align: 'left',
  },
]);

enum BtnTable {
  EDIT = 'edit',
  DELETE = 'delete',
}
const tableButtons = ref<BtnType[]>([
  {
    label: '編輯',
    icon: BtnTable.EDIT,
    status: BtnTable.EDIT,
  },
  {
    label: '刪除',
    icon: BtnTable.DELETE,
    status: BtnTable.DELETE,
  },
]);

async function handleClickOption(btn: BtnType, data: BaseCRUDTest) {
  switch (btn.status) {
    case BtnTable.EDIT:
      currentStatus.value = CreateOrEdit.EDIT;
      inputData.value.name = data.name;
      inputData.value.age = data.age.toString();
      inputData.value.id = data.id;
      break;
    case BtnTable.DELETE:
      await deleteCRUDTest(data.id);
      await getCRUDTest();
      break;
  }

}
</script>

<template>
  <q-page class="row q-pt-xl">
    <div class="full-width q-px-xl">
      <div class="q-mb-xl">
        <q-input v-model="inputData.name" label="姓名" />
        <q-input v-model="inputData.age" label="年齡" />
        <q-btn color="primary" class="q-mt-md" @click="createOrEditData">{{currentStatus === CreateOrEdit.CREATE ? '新增' : '修改'}}</q-btn>
      </div>

      <q-table
        flat
        bordered
        ref="tableRef"
        :rows="toDoStore.todoList"
        :columns="(tableConfig as QTableProps['columns'])"
        row-key="id"
        hide-pagination
        separator="cell"
        :rows-per-page-options="[0]"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
            <q-th></q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              style="min-width: 120px"
            >
              <div>{{ col.value }}</div>
            </q-td>
            <q-td class="text-right" auto-width v-if="tableButtons.length > 0">
              <q-btn
                @click="handleClickOption(btn, props.row)"
                v-for="(btn, index) in tableButtons"
                :key="index"
                size="sm"
                color="grey-6"
                round
                dense
                :icon="btn.icon"
                class="q-ml-md"
                padding="5px 5px"
              >
                <q-tooltip
                  transition-show="scale"
                  transition-hide="scale"
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[10, 10]"
                >
                  {{ btn.label }}
                </q-tooltip>
              </q-btn>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:no-data="{ icon }">
          <div
            class="full-width row flex-center items-center text-primary q-gutter-sm"
            style="font-size: 18px"
          >
            <q-icon size="2em" :name="icon" />
            <span> 無相關資料 </span>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>



<style lang="scss" scoped>
.q-table th {
  font-size: 20px;
  font-weight: bold;
}

.q-table tbody td {
  font-size: 18px;
}
</style>
