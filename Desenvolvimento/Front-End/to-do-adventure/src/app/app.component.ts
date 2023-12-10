import { AppService } from './service/app.service';
import { Component } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MatDialog} from '@angular/material/dialog';
import { DialogFormMissionComponent } from './dialog-form-mission/dialog-form-mission.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'to-do-adventure';

  disponiveis = ['Escovar os dentes', 'Usar fio dental', 'Fazer SkinCare'];

  andamento = ['Escovar os dentes'];

  concluidas = ['Escovar os dentes', 'Escovar os dentes'];

  todoObjects = this.disponiveis.map(item => ({
    title: item,
    description: `Description for ${item}`,
    deadline: '19/12/2023',
    difficulty: 'Fácil'
  }));

   doneObjects = this.andamento.map(item => ({
    title: item,
    description: `Description for ${item}`,
    deadline: '19/12/2023',
    difficulty: 'Média'
  }));

  doneObjects2 = this.concluidas.map(item => ({
    title: item,
    description: `Description for ${item}`,
    deadline: '19/12/2023',
    difficulty: 'Média'
  }));

  constructor(
    public dialog: MatDialog,
    public appService: AppService
    ) {}

    ngOnInit(){
      this.getMissions();
    }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  openDialogMission(data: any){
    const dialogRef = this.dialog.open(DialogFormMissionComponent, {data});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }

  getMissions(){
    this.appService.getMissions().subscribe(
      data => this.missions = data.missions,
      error => console.error('Erro ao obter missões', error)
    );
  }

  createTask() {
    const newTask = {
      title: 'Nova Tarefa',
      description: 'Descrição da Nova Tarefa',
      deadline: '2023-12-31',
      difficulty: 'Média'
    };

    this.appService.createTask(newTask).subscribe(response => {
      console.log(response);
      this.reloadTasks();
    });
  }

  updateTask() {
    const taskId = '1'; // Substitua pelo ID da tarefa que você deseja atualizar
    const updatedTask = {
      title: 'Tarefa Atualizada',
      description: 'Descrição Atualizada',
      deadline: '2023-12-31',
      difficulty: 'Alta'
    };

    this.appService.updateTask(taskId, updatedTask).subscribe(response => {
      console.log(response);
      this.reloadTasks();
    });
  }

  deleteTask() {
    const taskId = '1'; // Substitua pelo ID da tarefa que você deseja excluir

    this.appService.deleteTask(taskId).subscribe(response => {
      console.log(response);
      this.reloadTasks();
    });
  }

  private reloadTasks() {
    this.appService.getMissions().subscribe(data => {
      this.missions = data;
    });
  }
}
