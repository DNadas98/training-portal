import {FormEvent, useEffect, useState} from "react";
import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {
  useNotification
} from "../../../common/notification/context/NotificationProvider.tsx";
import {useNavigate, useParams} from "react-router-dom";
import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {ExpenseResponseDto} from "../../dto/ExpenseResponseDto.ts";
import {
  PermissionType
} from "../../../authentication/dto/applicationUser/PermissionType.ts";
import {ExpenseAddUpdateRequestDto} from "../../dto/ExpenseAddUpdateRequestDto.ts";

export default function Expenses() {
  const {loading: permissionsLoading, projectPermissions, taskPermissions} = usePermissions();
  const companyId = useParams()?.companyId;
  const projectId = useParams()?.projectId;
  const taskId = useParams()?.taskId;
  const [expensesLoading, setExpensesLoading] = useState<boolean>(true);
  const [expenses, setExpenses] = useState<ExpenseResponseDto[]>([]);

  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();
  const [addDisabled, setAddDisabled] = useState<boolean>(false);
  const idIsValid = (id: string | undefined) => {
    return id && !isNaN(parseInt(id)) && parseInt(id) > 0
  };

  function handleErrorNotification(message?: string) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: `${message ?? "Failed to load expenses for the selected task"}`
    });
  }

  async function loadExpensesOfTask() {
    try {
      setExpensesLoading(true);
      const response = await authJsonFetch({
        path: `companies/${companyId}/projects/${projectId}/tasks/${taskId}/expenses`
      });
      if (!response?.status || response.status > 399 || !response?.data) {
        setExpenses([]);
        handleErrorNotification(response?.error);
        return;
      }
      setExpenses(response.data as ExpenseResponseDto[]);
    } catch (e) {
      setExpenses([]);
    } finally {
      setExpensesLoading(false);
    }
  }

  useEffect(() => {
    if (!idIsValid(companyId) || !idIsValid(projectId) || !idIsValid(taskId)) {
      handleErrorNotification("The provided company, project or task ID is invalid");
      setExpenses([]);
      setExpensesLoading(false);
      return;
    } else {
      loadExpensesOfTask().then();
    }
  }, []);

  const handleUpdate = async (event: FormEvent<HTMLFormElement>, expenseId: number) => {
    try {
      event.preventDefault();
      setExpensesLoading(true);
      const updateDto = getRequestDto(event.currentTarget);
      const response = await authJsonFetch({
        path: `companies/${companyId}/projects/${projectId}/tasks/${taskId}/expenses/${expenseId}`,
        method: "PUT",
        body: updateDto
      });
      if (!response || response.error || response?.status > 399 || !response.data) {
        handleErrorNotification(response?.error ?? "Failed to update expense details");
        return;
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: response.message ?? "Expense details updated successfully"
      });
      await loadExpensesOfTask();
    } catch (e) {
      handleErrorNotification("Failed to update expense details");
    } finally {
      setExpensesLoading(false);
    }
  }


  function getRequestDto(currentTarget: EventTarget & HTMLFormElement): ExpenseAddUpdateRequestDto {
    const formData = new FormData(currentTarget);

    return {
      name: formData.get('name') as string,
      price: formData.get('price') as number,
      paid: formData.has("paid") as boolean
    }
  }

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setAddDisabled(true);
      const addDto = getRequestDto(event.currentTarget);
      const response = await authJsonFetch({
        path: `companies/${companyId}/projects/${projectId}/tasks/${taskId}/expenses`,
        method: "POST",
        body: addDto
      });
      if (!response || response.error || response?.status > 399 || !response.data) {
        handleErrorNotification(response?.error ?? "Failed to add expense");
        return;
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: response.message ?? "Expense added successfully"
      });
      await loadExpensesOfTask();
    } catch (e) {
      handleErrorNotification("Failed to add expense");
    } finally {
      setAddDisabled(false);
    }
  }

  const handleDelete = async (expenseId:number) => {
    try {
      setExpensesLoading(true);
      const response = await authJsonFetch({
        path: `companies/${companyId}/projects/${projectId}/tasks/${taskId}/expenses/${expenseId}`,
        method: "DELETE"
      });
      if (!response || response.error || response?.status > 399 || !response.message) {
        handleErrorNotification(response?.error ?? "Failed to remove expense");
        return;
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: response.message ?? "Expense removed successfully"
      });
      await loadExpensesOfTask();
    } catch (e) {
      handleErrorNotification("Failed to remove expense");
    } finally {
      setExpensesLoading(false);
    }
  }

  if (permissionsLoading || expensesLoading) {
    return <LoadingSpinner/>;
  } else if (!projectPermissions?.length) {
    handleErrorNotification("Access Denied: Insufficient permissions");
    navigate(`/companies/${companyId}/projects`, {replace: true});
    return <></>;
  }

  return (
    <div>
      <h3>Expenses</h3>
      <p>Task permissions: {taskPermissions.join(", ")}</p>
      {taskPermissions.includes(PermissionType.TASK_ASSIGNED_EMPLOYEE) &&
          <form onSubmit={(event) => {
            handleAdd(event).then();
          }}>
              <input type="text" name={"name"} required
                     minLength={1} maxLength={50} placeholder={"Name"}/>
              <input type="number" name={"price"} required min={0} placeholder={"Price"}/>
              <label htmlFor="`paid-${expense.expenseId}`">Paid: </label>
              <input type="checkbox" id={`paid-addExpense`} name={"paid"}/>
              <button type={"submit"} disabled={addDisabled}>Add new expense</button>
          </form>}
      {expenses?.length
        ? <ul>
          {expenses.map(expense => {
            return (<li key={expense.expenseId}>
              {taskPermissions.includes(PermissionType.TASK_ASSIGNED_EMPLOYEE)
                ?<div><form onSubmit={(event) => {
                  handleUpdate(event, expense.expenseId).then();
                }}>
                  <input type="text" name={"name"} defaultValue={expense.name} required
                         minLength={1} maxLength={50} placeholder={"Name"}/>
                  <input type="number" name={"price"} defaultValue={expense.price}
                         required min={0} step={0.0001} placeholder={"Price"}/>
                  <label htmlFor="`paid-${expense.expenseId}`">Paid: </label>
                  <input type="checkbox" id={`paid-${expense.expenseId}`} name={"paid"}
                         defaultChecked={expense.paid}/>
                  <button type={"submit"} disabled={expensesLoading}>Save</button>
                </form>
                  <button onClick={()=>{
                    handleDelete(expense.expenseId).then()
                  }} disabled={expensesLoading}>Remove</button>
              </div>
                : <div>
                  <h4>{expense.name}</h4>
                  <p>Price: {expense.price}</p>
                  <p>{expense.paid ? "Paid" : "Not paid yet"}</p>
                </div>}
            </li>)
          })}
        </ul>
        : <p>There aren't any expenses added to this task yet.</p>}
      <button onClick={()=>{
        navigate(`/companies/${companyId}/projects/${projectId}/tasks/${taskId}`)
      }}>Back</button>
    </div>
  )
}
