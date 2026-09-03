import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const PageStaticTestsDescription = ({ osData }) => {
  return (
    <div className="page a4-page">
      <Header unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} titulo="RELATÓRIO TÉCNICO" />
      
      <main className="page-body p14-static-desc-layout">
        
        {/* SEÇÃO 1: RESISTÊNCIA DE ISOLAMENTO */}
        <section className="text-block-section">
          <h2 className="main-topic-title">Ensaios Estáticos – Medição de resistência de isolamento (Megômetro)</h2>
          
          <p className="narrative-paragraph">
            O ensaio de resistência de isolamento foi realizado com o objetivo de avaliar as condições dielétricas do sistema de isolamento do estator, verificando a integridade elétrica entre enrolamentos e carcaça (terra), conforme metodologia recomendada pela norma <strong>IEEE 43-2013</strong>.
          </p>
          
          <p className="narrative-paragraph">
            Para a execução do ensaio foi utilizado megômetro digital devidamente calibrado, com certificado rastreável, dentro do prazo de validade na data da medição.
          </p>
          
          <p className="narrative-paragraph">
            O ensaio foi realizado com o motor completamente desconectado da rede elétrica, com os terminais isolados e aterrados antes e após cada medição, conforme procedimento de segurança aplicável. A tensão de ensaio aplicada foi de <strong>0,5 kVcc</strong>, compatível com a tensão nominal do equipamento, respeitando os critérios estabelecidos na IEEE 43-2013.
          </p>
          
          <p className="narrative-paragraph">
            A medição foi conduzida com aplicação contínua da tensão por período de 10 (dez) minutos, sendo registrados os valores em 30 segundos, 1 minuto e 10 minutos, possibilitando a determinação dos seguintes parâmetros:
          </p>

          <ul className="technical-bullet-list">
            <li>Resistência de isolamento corrigida para 40°C</li>
            <li>Índice de Absorção (IA = R60s / R30s)</li>
            <li>Índice de Polarização (IP = R10min / R1min)</li>
          </ul>

          <p className="narrative-paragraph">
            Os valores obtidos foram comparados com os limites mínimos recomendados pela IEEE 43-2013, que estabelece que, para máquinas rotativas com tensão nominal inferior a 1 kV, o valor mínimo aceitável de resistência de isolamento deve ser superior a <strong>(kV + 1) MΩ</strong>, corrigido para 40°C, sendo recomendável que o Índice de Polarização (IP) seja <strong>≥ 2,0</strong> para indicar condição satisfatória do isolamento.
          </p>
          
          <p className="narrative-paragraph">
            Os resultados obtidos encontram-se apresentados em tabela e gráfico comparativo acima, permitindo a análise do comportamento da curva de absorção dielétrica ao longo do tempo. A tendência crescente da resistência ao longo do período de ensaio indica adequada condição do isolamento e ausência de umidade significativa ou contaminação interna.
          </p>
        </section>

        <div className="section-divider-line"></div>

        {/* SEÇÃO 2: RESISTÊNCIA ÔHMICA */}
        <section className="text-block-section">
          <h2 className="main-topic-title">Ensaios Estáticos – Medição de resistência ôhmica (Miliohmímetro)</h2>
          
          <p className="narrative-paragraph">
            O ensaio de resistência ôhmica dos enrolamentos foi realizado com a finalidade de avaliar o equilíbrio elétrico entre fases, identificando possíveis variações decorrentes de conexões inadequadas, falhas parciais de espiras, soldas defeituosas ou diferenças significativas de seção condutiva.
          </p>
          
          <p className="narrative-paragraph">
            Para a execução do ensaio foi utilizado Miliohmímetro digital de alta precisão. O equipamento opera com injeção de corrente contínua estabilizada, eliminando interferências por resistência de contato através do método de medição Kelvin, garantindo maior precisão na leitura de resistências de baixo valor.
          </p>
          
          <p className="narrative-paragraph">
            Foram realizadas medições individuais nas 03 fases do motor, com registro dos valores absolutos em miliohms (mΩ). As medições foram efetuadas com o motor à temperatura ambiente controlada, sendo posteriormente corrigidas, quando aplicável, para a temperatura de referência.
          </p>
          
          <p className="narrative-paragraph">
            Conforme diretrizes da IEEE 43-2013 e boas práticas internacionais de ensaios em máquinas rotativas, considera-se aceitável um desequilíbrio percentual entre fases <strong>inferior a 5%</strong>. Valores superiores podem indicar anomalias no enrolamento ou nas conexões internas.
          </p>

          {/* Bloco de Fórmula Matemática Tipografada 
          <div className="formula-display-card">
            <div className="formula-title">Expressão de Cálculo do Desequilíbrio</div>
            <div className="formula-body">
              Desequilíbrio (%) = <span>(Maior valor − Menor valor)</span> / Valor médio × 100
            </div>
          </div>
          */}

          <p className="narrative-paragraph">
            Os resultados obtidos encontram-se apresentados em tabela a seguir, acompanhados de registro fotográfico do equipamento ensaiado (vista lateral), assegurando rastreabilidade técnica do procedimento.
          </p>
          
          <p className="narrative-paragraph">
            Os valores medidos indicam comportamento elétrico equilibrado entre fases, não sendo identificadas evidências de curto entre espiras, conexões defeituosas ou assimetrias relevantes no sistema de enrolamento.
          </p>
        </section>

      </main>

      <Footer pageNumber="14" unidade={osData?.unidade_nome} />
    </div>
  );
};