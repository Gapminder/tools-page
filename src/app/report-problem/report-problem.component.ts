import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-report-problem',
  templateUrl: './report-problem.component.html',
  styleUrls: ['./report-problem.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportProblemComponent {
  @Input() isFlashAvailable: boolean = false;
}
