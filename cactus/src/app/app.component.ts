import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import MistralClient from '@mistralai/mistralai';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cactus';

  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //
  //  Replace "environment.api_token" with a mistral token.
  //
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  client = new MistralClient(environment.api_token);

  question = '';
  message = '';
  answers: string = '';
  closewhys: string[] = [];
  openwhys: string[] = [];
  count = 0;
  state = "start";
  synthese: string = '';
  first: boolean = true;
  fistQuestion: string = '';
  selectQuestion: string[] = [];
  faireSynthese: boolean = false;
  instruction: string = 'Posez une question';
  spinner: boolean = false;
  textareaApears: boolean = true;
  resume: any[] = [];

  public async button() {
    if(this.state === 'start') {
      if(this.first) {
        this.fistQuestion = this.question;

        this.first = false;
      }
      
      this.resume.push({ open: this.question, closes: [] });

      await this.newBranche();
      this.askCloseWhy(this.count--);
      this.state = 'closewhy';
      this.question = '';
    } else if(this.state === 'closewhy') {
      this.saveCloseWhy();
      this.askCloseWhy(this.count--);
      if(this.count === 0) {
        this.state = 'openwhy';
      }
      this.question = '';
    }
    else if (this.state === 'openwhy') {
      this.saveCloseWhy();
      console.log(this.answers);
      this.askOpenWhys();
      this.state = 'selectopenwhy';
      this.question = '';
      this.textareaApears = false;
    }

    console.log(this.resume);
  }

  public async selection(event: any) {
    this.question = event.target.value;

    this.resume.push({ open: this.question, closes: [] });

    await this.newBranche();
    this.askCloseWhy(this.count--);
    this.state = 'closewhy';
    this.question = '';
    this.selectQuestion = [];
    this.faireSynthese = true;
    this.textareaApears = true;
  }

  private async newBranche() {
    this.spinner = true;

    const chatStreamResponse = this.client.chatStream({
      model: "mistral-small",
      messages: [{ role: "user", content: "Donne une liste des questions à se poser pour répondre à la question suivante en posant des questions fermés en premier et en suite des questions ouvertes. Les questions de la liste ne devrons pas être des questions de rhétoriques, de clarification, de sondage et ne doivent pas être des questions pièges ou hypothétiques. Si deux questions sont trop proche ou on le même sens pose en une seule  pour les remplacer dans ta liste. Tu placeras tes question dans un fichier json de la manière suivante: { closewhy: ['Première question fermé ?', 'Deuxième question fermé ?', '...'], openwhy: ['Première question ouverte ?', 'Deuxième question ouverte ?', '...']} Voici la question : " + this.question }],
    });

    console.log("Chat Stream:");

    let value = '';

    for await (const chunk of chatStreamResponse) {
        if (chunk.choices[0].delta.content !== undefined) {
            const streamText = chunk.choices[0].delta.content;
            value += streamText;
        }
    }

    this.spinner = false;
    this.saveAnswers(value);
  }

  private saveAnswers(answers: string) {
    console.log(answers);
    this.closewhys = JSON.parse(answers).closewhy;
    this.count = this.closewhys.length;
    this.openwhys = JSON.parse(answers).openwhy;
  }

  private askCloseWhy(count: number) {
    this.instruction = 'Répondez à cette question : ';
    this.message =  this.closewhys[this.count];
  }

  private saveCloseWhy() {
    this.answers += ' ' + this.closewhys[this.count] + ' ' + this.question; 
    this.resume[this.resume.length - 1].closes.push({ question: this.closewhys[this.count], answer: this.question});
  }

  private askOpenWhys() {
    this.instruction = 'Sélectionner une question à développer : ';
    this.message = '';

    this.selectQuestion = this.openwhys;
  }

  public async doSynthese() {
    this.spinner = true;

    const chatStreamResponse = this.client.chatStream({
      model: "mistral-small",
      messages: [{ role: "user", content: "Peux tu répondre à la question" + '"' + this.fistQuestion + '"' + "sous forme de synthèse courte et concise en sachant que j'ai donné les réponse suivante à ces questions : " + this.answers + ' Ensuite tu fera une critique de cette synthèse en appuyant tes propos avec des sources. Fait un texte agréable à lire.'}],
    });
    
    console.log("Chat Stream:");

    let value = '';

    for await (const chunk of chatStreamResponse) {
        if (chunk.choices[0].delta.content !== undefined) {
            const streamText = chunk.choices[0].delta.content;
            value += streamText;
        }
    }

    this.spinner = false;
    this.synthese = value;
  }

  
}
