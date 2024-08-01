interface TreeConfig {
  label?: string
  value?: any
}
interface IOption<T = any> {
  text: string
  value: T
  parentId?: string | number | null
  children?: IOption[] | null
}
export function mapOptionTree(list: any[], { label = 'label', value = 'value' }: TreeConfig = {}) {
  function _mapOptionTree(list: any[]): IOption[] {
    const newList = []
    for (const item of list) {
      const newItem: IOption = {
        text: item[label],
        value: item[value],
        parentId: item.parentId,
      }
      if (item.children && item.children.length) {
        newItem.children = _mapOptionTree(item.children)
      }
      newList.push(newItem)
    }
    return newList
  }
  return _mapOptionTree(list)
}
