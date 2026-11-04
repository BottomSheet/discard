import { ref } from 'vue'
import { defineStore } from 'pinia'
import { matchesAccessCode } from '@/utils/access'
import { readStorage, writeStorage } from '@/utils/storage'

const STORAGE_KEY = 'eva-quest:access:v1'

/** Не является защитой конфиденциальной информации: код проверяется локально. */
export const useAccessStore = defineStore('access', () => {
  const isUnlocked = ref(readStorage(STORAGE_KEY) === true)

  function unlock(code: string): boolean {
    if (!matchesAccessCode(code)) return false
    isUnlocked.value = true
    writeStorage(STORAGE_KEY, true)
    return true
  }

  return { isUnlocked, unlock }
})
