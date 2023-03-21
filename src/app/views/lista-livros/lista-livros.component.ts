import { Item } from './../../models/interfaces';
import { LivroService } from './../../service/livro.service';
import { Component } from '@angular/core';
import { switchMap, map, tap, filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { FormControl } from '@angular/forms';

const PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent{

  // FormControl é possível ter acesso a valores, status de validação e interações do usuário e eventos
  campoBusca = new FormControl();

  constructor(private service: LivroService) { }

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    // O 'debounceTime' serve para dar um delay à busca para que o usuário consiga preencher o input e logo começar a buscar pela string inteira
    debounceTime(PAUSA),

    // O 'filter' recebe uma condição, a qual, se for satisfeita por um dado inserido/recebido, o fluxo de comandos segue.
    filter((valorDigitado) => valorDigitado.length >= 3),
    tap(() => console.log('Fluxo Inicial: ')),

    // O 'distinctUntilChanged' serve para comparar valores recebidos e a requisição só é feita quando os valores são diferentes
    distinctUntilChanged(),

    // O 'switchMap' utiliza apenas o último valor digitado para fazer a requisição, ele desconsidera os valores anteriormente inputados
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    tap(() => console.log('Requisição ao servidor: ')),
    map(items => this.livrosResultadoParaLivros(items))
    )

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item)
    })
  }

  // O ngOnDestroy serve para fazer o unsubscribe, porém o pipe async ( | async ) já realiza isso quando inserido no template HTML
  // ngOnDestroy() {
  //   // Encerra o Observable para liberar recursos e cancelar execuções do Observable
  //   this.subscription.unsubscribe();
  // }
}
