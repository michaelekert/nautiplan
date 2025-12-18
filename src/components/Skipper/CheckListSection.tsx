import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { initialCategories } from "@/data/Skipper/checklists"
import type { Checklist, ChecklistCategory } from "@/types/Skipper/skipper"

export function ChecklistSection() {
  const [categories, setCategories] = useState<ChecklistCategory[]>(initialCategories)

  const toggleItem = (categoryName: string, checklistTitle: string, itemText: string) => {
    setCategories(prev =>
      prev.map(category =>
        category.name === categoryName
          ? {
              ...category,
              checklists: category.checklists.map(checklist =>
                checklist.title === checklistTitle
                  ? {
                      ...checklist,
                      items: checklist.items.map(item =>
                        item.text === itemText ? { ...item, checked: !item.checked } : item
                      ),
                    }
                  : checklist
              ),
            }
          : category
      )
    )
  }

  const isChecklistComplete = (checklist: Checklist) => {
    return checklist.items.length > 0 && checklist.items.every(item => item.checked)
  }

  const getCategoryProgress = (category: ChecklistCategory) => {
    const totalItems = category.checklists.reduce((sum, cl) => sum + cl.items.length, 0)
    const checkedItems = category.checklists.reduce(
      (sum, cl) => sum + cl.items.filter(item => item.checked).length,
      0
    )
    return { 
      total: totalItems, 
      checked: checkedItems, 
      percentage: totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0 
    }
  }

  return (
    <div className="space-y-3">
      {categories.map(category => {
        const progress = getCategoryProgress(category)
        return (
          <Accordion type="single" collapsible className="w-full" key={category.name}>
            <AccordionItem
              value={category.name}
              className={`!border !border-solid rounded-lg overflow-hidden px-4 transition-colors
                ${progress.percentage === 100 ? "bg-green-50 !border-green-300" : "bg-white !border-gray-200"}
              `}
            >
              <AccordionTrigger className="hover:no-underline w-full">
                <div className="flex flex-col w-full gap-2 text-left">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span className="md:text-xl text-sm">{category.icon}</span>
                      <h2 className="md:text-xl font-bold text-sm">{category.name}</h2>
                    </div>

                    {progress.percentage === 100 && (
                      <span className="text-xs bg-green-600 text-white px-2 py-0.5 h-5 flex items-center rounded-full whitespace-nowrap">
                        ✓ Ukończono
                      </span>
                    )}
                  </div>

                  <div className="w-full">
                    <Progress value={progress.percentage} className="w-full h-2" />
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pt-4 px-3">
                <Accordion type="single" collapsible className="w-full space-y-2">
                  {category.checklists.map(checklist => {
                    const isComplete = isChecklistComplete(checklist)
                    return (
                      <AccordionItem
                        key={checklist.title}
                        value={checklist.title}
                        className={`!border !border-solid rounded-lg overflow-hidden ${
                          isComplete ? "bg-green-50 !border-green-300" : "bg-white !border-gray-200"
                        }`}
                      >
                        <AccordionTrigger
                          className={`px-4 hover:no-underline ${
                            isComplete ? "text-green-900 font-semibold" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{checklist.title}</span>
                            {isComplete && (
                              <span className="text-xs bg-green-600 text-white px-2 py-0.5 h-5 flex items-center rounded-full whitespace-nowrap">
                                ✓ Ukończono
                              </span>
                            )}
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="px-4 pb-4">
                          <ul className="space-y-3">
                            {checklist.items.map(item => (
                              <li key={item.text} className="flex items-start gap-3">
                                <Checkbox
                                  id={item.text}
                                  checked={item.checked}
                                  onCheckedChange={() => toggleItem(category.name, checklist.title, item.text)}
                                  className="mt-0.5"
                                />
                                <label
                                  htmlFor={item.text}
                                  className={`text-sm cursor-pointer flex-1 ${
                                    item.checked ? "line-through text-gray-500" : ""
                                  }`}
                                >
                                  {item.text}
                                </label>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )
      })}
    </div>
  )
}