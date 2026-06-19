"use client";
import React, { useState, useMemo } from 'react';
import { ChevronRight, MessageCircle, AlertCircle } from 'lucide-react';

export default function DiagnosticForm() {
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [contactData, setContactData] = useState({ 
    nombre: '', 
    email: '', 
    empresa: '', 
    telefono: '',
    tamaño: '',
    rubro: ''
  });

  const sections = [
    {
      title: 'Gobernanza y Estructura',
      subtitle: 'Riesgo Organizacional',
      icon: '🏢',
      questions: [
        {
          id: 'q1',
          text: '¿Has designado a una persona responsable de la protección de datos?',
          options: [
            { label: 'Sí, responsable formalmente designado', weight: 0 },
            { label: 'Tenemos alguien informalmente', weight: 2 },
            { label: 'No, aún no asignamos', weight: 3 },
            { label: 'No sé / No aplica', weight: 2 },
          ],
        },
        {
          id: 'q2',
          text: '¿Existe un comité que revise cómo tratas datos personales?',
          options: [
            { label: 'Sí, comité formal que se reúne regularmente', weight: 0 },
            { label: 'Reuniones informales ocasionales', weight: 2 },
            { label: 'No existe ninguna instancia', weight: 3 },
            { label: 'No sé / No aplica', weight: 2 },
          ],
        },
      ],
    },
    {
      title: 'Inventario y Visibilidad',
      subtitle: 'Riesgo de Control',
      icon: '📋',
      questions: [
        {
          id: 'q3',
          text: '¿Has mapeado qué datos personales recolectas y tratas?',
          options: [
            { label: 'Sí, catálogo completo y actualizado', weight: 0 },
            { label: 'Parcialmente documentado', weight: 1 },
            { label: 'Idea general sin documentación formal', weight: 2 },
            { label: 'No, sin claridad sobre qué datos tratamos', weight: 3 },
          ],
        },
        {
          id: 'q4',
          text: '¿Tratas datos sensibles? (salud, religión, biométricos, menores, etc.)',
          options: [
            { label: 'No, solo datos básicos', weight: 0 },
            { label: 'Algunos sensibles limitados', weight: 1 },
            { label: 'Sí, y está documentado control', weight: 0 },
            { label: 'Sí, sin control específico documentado', weight: 3 },
          ],
        },
        {
          id: 'q5',
          text: '¿Sabes dónde se almacenan los datos? (servidores, nube, terceros)',
          options: [
            { label: 'Visibilidad completa', weight: 0 },
            { label: 'Parcialmente, distribuido', weight: 1 },
            { label: 'Distribuido sin control centralizado', weight: 2 },
            { label: 'Sin visibilidad clara', weight: 3 },
          ],
        },
      ],
    },
    {
      title: 'Políticas y Documentación',
      subtitle: 'Riesgo Legal',
      icon: '📄',
      questions: [
        {
          id: 'q6',
          text: '¿Tienes política de protección de datos publicada en tu web?',
          options: [
            { label: 'Sí, actualizada según ley 21.719', weight: 0 },
            { label: 'Sí, pero antigua/desactualizada', weight: 2 },
            { label: 'Algo informal, no formalizado', weight: 2 },
            { label: 'No tenemos política', weight: 3 },
          ],
        },
        {
          id: 'q7',
          text: '¿Documentaste el propósito específico de cada dato?',
          options: [
            { label: 'Sí, cada dato tiene propósito documentado', weight: 0 },
            { label: 'Aproximadamente, sin formalizar', weight: 1 },
            { label: 'No, recolectamos genéricamente', weight: 3 },
            { label: 'No sé / No aplica', weight: 2 },
          ],
        },
        {
          id: 'q8',
          text: '¿Tienes proceso para solicitudes (acceso, rectificación, eliminación)?',
          options: [
            { label: 'Sí, formalizados con plazos de 20 días', weight: 0 },
            { label: 'Parcialmente, sin proceso formal', weight: 2 },
            { label: 'No tenemos proceso definido', weight: 3 },
            { label: 'No sabía que fuera obligatorio', weight: 3 },
          ],
        },
      ],
    },
    {
      title: 'Seguridad Técnica',
      subtitle: 'Riesgo de Brechas',
      icon: '🔐',
      questions: [
        {
          id: 'q9',
          text: '¿Tienes medidas de seguridad técnicas?',
          options: [
            { label: 'Sí, según ISO 27001 o similar', weight: 0 },
            { label: 'Sí, básicas pero sin evaluación formal', weight: 1 },
            { label: 'Algunas medidas informales', weight: 2 },
            { label: 'Medidas mínimas o ninguna', weight: 3 },
          ],
        },
        {
          id: 'q10',
          text: '¿Compartes datos con terceros/proveedores con contrato?',
          options: [
            { label: 'Sí, con contratos de tratamiento específicos', weight: 0 },
            { label: 'Sí, pero sin protecciones en contratos', weight: 2 },
            { label: 'Sí, sin formalizar nada', weight: 3 },
            { label: 'No compartimos datos con terceros', weight: 0 },
          ],
        },
        {
          id: 'q11',
          text: '¿Trasfieres datos al extranjero?',
          options: [
            { label: 'No, todo en Chile', weight: 0 },
            { label: 'Sí, con protección equivalente documentada', weight: 0 },
            { label: 'Sí, sin evaluar protección del país', weight: 2 },
            { label: 'Sí, a países de alto riesgo', weight: 3 },
          ],
        },
      ],
    },
    {
      title: 'Decisiones Automatizadas',
      subtitle: 'Riesgo de Discriminación',
      icon: '🤖',
      questions: [
        {
          id: 'q12',
          text: '¿Usas sistemas automatizados para decisiones?',
          options: [
            { label: 'No utilizamos automatización para decisiones', weight: 0 },
            { label: 'Sí, con supervisión humana documentada', weight: 1 },
            { label: 'Sí, sin saber cómo decide el sistema', weight: 3 },
            { label: 'Sí, sin derechos de cuestionamiento', weight: 3 },
          ],
        },
        {
          id: 'q13',
          text: '¿Tienes datos de menores de edad?',
          options: [
            { label: 'No tenemos datos de menores', weight: 0 },
            { label: 'Sí, con protecciones especiales documentadas', weight: 0 },
            { label: 'Sí, tratamos igual que adultos', weight: 3 },
            { label: 'Sí, sin evaluar riesgos', weight: 3 },
          ],
        },
      ],
    },
    {
      title: 'Tiempo y Seguridad',
      subtitle: 'Riesgo Operacional',
      icon: '⏱️',
      questions: [
        {
          id: 'q14',
          text: '¿Definiste cuánto tiempo conservarás cada dato?',
          options: [
            { label: 'Sí, con política de eliminación documentada', weight: 0 },
            { label: 'Aproximadamente, informalmente', weight: 1 },
            { label: 'Tenemos datos sin fecha de eliminación', weight: 2 },
            { label: 'No, guardamos indefinidamente', weight: 3 },
          ],
        },
        {
          id: 'q15',
          text: '¿Tienes protocolo para reportar brechas de seguridad?',
          options: [
            { label: 'Sí, formalizado con pasos y responsables', weight: 0 },
            { label: 'Parcialmente, sin documentación formal', weight: 2 },
            { label: 'No tenemos protocolo definido', weight: 3 },
            { label: 'No sabía que esto fuera requerido', weight: 3 },
          ],
        },
      ],
    },
    {
      title: 'Capacitación y Regulación',
      subtitle: 'Riesgo de Incumplimiento',
      icon: '📚',
      questions: [
        {
          id: 'q16',
          text: '¿Capacitaste tu equipo sobre ley 21.719?',
          options: [
            { label: 'Sí, capacitación formal y periódica', weight: 0 },
            { label: 'Mínima o informal', weight: 2 },
            { label: 'No, no hemos capacitado', weight: 3 },
            { label: 'No sé / No aplica', weight: 2 },
          ],
        },
        {
          id: 'q17',
          text: '¿Sabes de la Agencia de Protección de Datos que fiscaliza desde dic 2026?',
          options: [
            { label: 'Sí, y estamos preparados para cumplir', weight: 0 },
            { label: 'Sí, pero no sabemos implicaciones', weight: 2 },
            { label: 'Vagamente, sin detalles', weight: 2 },
            { label: 'No, no sabía', weight: 3 },
          ],
        },
      ],
    },
    {
      title: 'Tu Empresa',
      subtitle: 'Información para Análisis Personalizado',
      icon: '🏭',
      questions: [
        {
          id: 'q18_tamaño',
          text: '¿Cuál es el tamaño de tu empresa?',
          options: [
            { label: 'Micro empresa (1-10 empleados)', weight: 0, category: 'tamaño' },
            { label: 'Pequeña (11-50 empleados)', weight: 0, category: 'tamaño' },
            { label: 'Mediana (51-200 empleados)', weight: 0, category: 'tamaño' },
            { label: 'Grande (200+ empleados)', weight: 0, category: 'tamaño' },
          ],
        },
        {
          id: 'q19_rubro',
          text: '¿Cuál es tu rubro/sector?',
          options: [
            { label: 'Tecnología / Software / SaaS', weight: 0, category: 'rubro' },
            { label: 'E-commerce / Retail', weight: 0, category: 'rubro' },
            { label: 'Salud / Farmacéutica', weight: 0, category: 'rubro' },
            { label: 'Educación', weight: 0, category: 'rubro' },
            { label: 'Finanzas / Banca / Seguros', weight: 0, category: 'rubro' },
            { label: 'Construcción / Inmobiliario', weight: 0, category: 'rubro' },
            { label: 'Manufactura / Industria', weight: 0, category: 'rubro' },
            { label: 'Servicios Profesionales', weight: 0, category: 'rubro' },
            { label: 'Otro', weight: 0, category: 'rubro' },
          ],
        },
      ],
    },
  ];

  const calculateScore = useMemo(() => {
    let totalWeight = 0;
    Object.entries(responses).forEach(([key, answer]) => {
      if (answer && key !== 'q18_tamaño' && key !== 'q19_rubro' && answer.weight !== undefined) {
        totalWeight += answer.weight;
      }
    });
    return totalWeight;
  }, [responses]);

  const getRiskLevel = (score) => {
    if (score <= 5) return { 
      level: '🟢 RIESGO BAJO', 
      color: 'bg-green-50 border-green-200', 
      textColor: 'text-green-700',
      icon: '✅',
      recommendation: 'Tu empresa tiene buena base en protección de datos. Solo mejoras menores necesarias.' 
    };
    if (score <= 12) return { 
      level: '🟡 RIESGO MODERADO', 
      color: 'bg-amber-50 border-amber-200', 
      textColor: 'text-amber-700',
      icon: '⚠️',
      recommendation: 'Hay gaps importantes en políticas y documentación que requieren atención.' 
    };
    if (score <= 25) return { 
      level: '🔴 RIESGO ALTO', 
      color: 'bg-red-50 border-red-200', 
      textColor: 'text-red-700',
      icon: '🚨',
      recommendation: 'Tu empresa tiene exposición significativa a incumplimientos.' 
    };
    return { 
      level: '🔴🔴 RIESGO CRÍTICO', 
      color: 'bg-red-100 border-red-300', 
      textColor: 'text-red-800',
      icon: '⛔',
      recommendation: 'Situación compleja que requiere intervención especializada y estructurada.' 
    };
  };

  const getWhatsAppMessage = (score, empresa, nombre, tamaño, rubro) => {
    const risk = getRiskLevel(score);
    const empresaText = empresa ? `Empresa: ${empresa}` : '';
    const nombreText = nombre ? `Nombre: ${nombre}` : '';
    const tamañoText = tamaño ? `Tamaño: ${tamaño}` : '';
    const rubroText = rubro ? `Rubro: ${rubro}` : '';
    
    const message = `Hola! Completé el diagnóstico de protección de datos personales (ley 21.719).

Mi resultado:
${risk.level}
Score: ${score}/51

${nombreText}
${empresaText}
${tamañoText}
${rubroText}

Me gustaría conocer más sobre cómo optimizar mi cumplimiento con la ley. ¿Podemos agendar una llamada?`;
    
    return encodeURIComponent(message);
  };

  const handleAnswerSelect = (questionId, option) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: option,
    }));

    // Guardar información de tamaño y rubro
    if (questionId === 'q18_tamaño') {
      setContactData(prev => ({ ...prev, tamaño: option.label }));
    }
    if (questionId === 'q19_rubro') {
      setContactData(prev => ({ ...prev, rubro: option.label }));
    }
  };

  const handleWhatsApp = () => {
    const waLink = `https://wa.me/56953348133?text=${getWhatsAppMessage(calculateScore, contactData.empresa, contactData.nombre, contactData.tamaño, contactData.rubro)}`;
    window.open(waLink, '_blank');
  };

  const section = sections[currentSection];
  const progress = ((currentSection + 1) / sections.length) * 100;
  const risk = getRiskLevel(calculateScore);

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 pt-8">
            <h1 className="text-4xl font-bold text-amber-400 mb-2">
              Tu Diagnóstico está Listo
            </h1>
            <p className="text-slate-300">Protección de Datos Personales - Ley 21.719</p>
          </div>

          {/* Risk Score */}
          <div className={`border-2 rounded-lg p-8 mb-8 ${risk.color}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`text-3xl font-bold ${risk.textColor}`}>{risk.level}</h2>
                <p className={`${risk.textColor} text-sm mt-1`}>Score: {calculateScore}/51 puntos</p>
              </div>
              <div className="text-6xl">{risk.icon}</div>
            </div>
            <p className={`${risk.textColor} text-base`}>{risk.recommendation}</p>
          </div>

          {/* Breakdown by Section */}
          <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
            <h3 className="text-xl font-bold text-amber-400 mb-4">Riesgos por Área</h3>
            <div className="space-y-3">
              {sections.slice(0, 7).map((sec, idx) => {
                const secQuestions = sec.questions;
                let secScore = 0;
                secQuestions.forEach((q) => {
                  if (responses[q.id]) {
                    secScore += responses[q.id].weight;
                  }
                });
                return (
                  <div key={idx} className="flex justify-between items-center pb-3 border-b border-slate-700 last:border-b-0">
                    <span className="text-slate-100">
                      <span className="text-xl mr-2">{sec.icon}</span>
                      <span className="font-semibold">{sec.title}</span>
                    </span>
                    <span className="text-amber-400 font-bold">{secScore} pts</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Información de Empresa */}
          <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
            <h3 className="text-lg font-bold text-amber-400 mb-4">Información de tu Empresa</h3>
            {contactData.tamaño && (
              <p className="text-slate-300 text-sm mb-2">
                <span className="text-amber-400 font-semibold">Tamaño:</span> {contactData.tamaño}
              </p>
            )}
            {contactData.rubro && (
              <p className="text-slate-300 text-sm">
                <span className="text-amber-400 font-semibold">Rubro:</span> {contactData.rubro}
              </p>
            )}
          </div>

          {/* Datos de Contacto (Capturar) */}
          <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
            <h3 className="text-lg font-bold text-amber-400 mb-4">Tu Información de Contacto</h3>
            <form className="space-y-3">
              <input
                type="text"
                placeholder="Tu nombre"
                value={contactData.nombre}
                onChange={(e) => setContactData({ ...contactData, nombre: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 px-4 py-2 rounded-lg focus:outline-none focus:border-amber-400 text-sm"
              />
              <input
                type="email"
                placeholder="Tu email"
                value={contactData.email}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 px-4 py-2 rounded-lg focus:outline-none focus:border-amber-400 text-sm"
              />
              <input
                type="text"
                placeholder="Nombre de tu empresa"
                value={contactData.empresa}
                onChange={(e) => setContactData({ ...contactData, empresa: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 px-4 py-2 rounded-lg focus:outline-none focus:border-amber-400 text-sm"
              />
              <input
                type="tel"
                placeholder="Teléfono (opcional)"
                value={contactData.telefono}
                onChange={(e) => setContactData({ ...contactData, telefono: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 px-4 py-2 rounded-lg focus:outline-none focus:border-amber-400 text-sm"
              />
            </form>
          </div>

          {/* WhatsApp Button - DESTACADO */}
          <button
            onClick={handleWhatsApp}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105 mb-4 flex items-center justify-center gap-3 text-lg shadow-lg"
          >
            <MessageCircle size={28} />
            Contactar por WhatsApp
          </button>

          {/* Footer CTA */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6 border border-amber-400/30 text-center">
            <p className="text-slate-300 text-sm mb-3">
              ¿Prefieres que te contactemos de otra forma?
            </p>
            <p className="text-amber-400 font-semibold text-sm">
              Axis Continuity<br />
              Consultoría Especializada en Cumplimiento & Riesgos
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-slate-400 text-xs mt-8">
            <p>Ley Nº 21.719 | Vigencia: 1 de diciembre de 2026</p>
            <p className="mt-2">© 2026 Axis Continuity - Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="inline-block bg-amber-400/10 border border-amber-400/30 rounded-lg px-4 py-2 mb-4">
              <span className="text-amber-400 text-sm font-bold">LEY 21.719</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-amber-400 mb-2">
            Diagnóstico de Riesgo
          </h1>
          <p className="text-slate-300">Protección de Datos Personales - 5 minutos</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-amber-400">
              {currentSection + 1} de {sections.length}
            </span>
            <span className="text-sm text-slate-400">
              Score: <span className="text-amber-400 font-bold">{calculateScore}</span> pts
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Section Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
          {/* Section Title */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-4xl">{section.icon}</span>
            <div>
              <h2 className="text-3xl font-bold">{section.title}</h2>
              <p className="text-slate-400 text-sm">{section.subtitle}</p>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-8">
            {section.questions.map((question) => (
              <div key={question.id} className="border-t border-slate-700 pt-8 first:border-t-0 first:pt-0">
                <p className="text-slate-100 font-semibold mb-4 text-lg">{question.text}</p>
                <div className="space-y-3">
                  {question.options.map((option, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${
                        responses[question.id]?.label === option.label
                          ? 'bg-amber-400/20 border-2 border-amber-400 shadow-lg shadow-amber-400/20'
                          : 'bg-slate-700 hover:bg-slate-600 border-2 border-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option.label}
                        checked={responses[question.id]?.label === option.label}
                        onChange={() => handleAnswerSelect(question.id, option)}
                        className="w-5 h-5 cursor-pointer accent-amber-400"
                      />
                      <span className="ml-4 text-slate-100">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
            className="flex-1 px-6 py-3 rounded-lg border-2 border-slate-600 text-slate-100 font-semibold hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>

          {currentSection === sections.length - 1 ? (
            <button
              onClick={() => setShowResults(true)}
              className="flex-1 px-6 py-3 bg-amber-400 text-slate-900 font-bold rounded-lg hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 text-lg"
            >
              Ver Resultados
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
              className="flex-1 px-6 py-3 bg-amber-400 text-slate-900 font-bold rounded-lg hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 text-lg"
            >
              Siguiente
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-slate-400 text-xs mt-8">
          <p>Ley Nº 21.719 | Entrada en vigor: 1 de diciembre de 2026</p>
          <p className="mt-2">© 2026 Axis Continuity</p>
        </div>
      </div>
    </div>
  );
}
