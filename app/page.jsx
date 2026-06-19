"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { ChevronRight, MessageCircle, Info, AlertCircle, CheckCircle } from 'lucide-react';

const CSS_STYLES = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: linear-gradient(135deg, #030712 0%, #0f172a 50%, #1a1f35 100%);
    color: white;
    scroll-behavior: smooth;
  }

  .diagnostic-container {
    min-height: 100vh;
    background: linear-gradient(to bottom right, #030712, #0f172a, #1a1f35);
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .diagnostic-wrapper {
    max-width: 900px;
    width: 100%;
  }

  .header {
    text-align: center;
    margin-bottom: 48px;
  }

  .header h1 {
    font-size: 36px;
    font-weight: 700;
    color: #fbbf24;
    margin-bottom: 8px;
  }

  .header p {
    color: #cbd5e1;
    font-size: 16px;
  }

  .badge {
    display: inline-block;
    background-color: rgba(251, 191, 36, 0.1);
    border: 1px solid rgba(251, 191, 36, 0.3);
    border-radius: 8px;
    padding: 8px 16px;
    margin-bottom: 16px;
    color: #fbbf24;
    font-size: 12px;
    font-weight: 600;
  }

  .disclaimer-box {
    background-color: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
    font-size: 12px;
    color: #cbd5e1;
    line-height: 1.6;
  }

  .disclaimer-box strong {
    color: #fbbf24;
  }

  .progress-container {
    margin-bottom: 32px;
  }

  .progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 14px;
  }

  .progress-label {
    color: #fbbf24;
    font-weight: 600;
  }

  .progress-score {
    color: #94a3b8;
  }

  .progress-score .score-value {
    color: #fbbf24;
    font-weight: 700;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background-color: #475569;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #fbbf24, #f59e0b);
    border-radius: 4px;
    transition: width 0.5s ease;
  }

  .section-card {
    background-color: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 32px;
    margin-bottom: 32px;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 32px;
  }

  .section-icon {
    font-size: 36px;
  }

  .section-title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .section-subtitle {
    color: #94a3b8;
    font-size: 14px;
  }

  .questions-container {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .question-group {
    border-top: 1px solid #475569;
    padding-top: 32px;
  }

  .question-group:first-child {
    border-top: none;
    padding-top: 0;
  }

  .question-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }

  .question-text {
    color: #e2e8f0;
    font-weight: 600;
    font-size: 18px;
    flex: 1;
  }

  .tooltip-icon {
    cursor: pointer;
    color: #fbbf24;
    flex-shrink: 0;
    padding-top: 2px;
  }

  .tooltip-text {
    position: absolute;
    background-color: #0f172a;
    border: 1px solid #fbbf24;
    border-radius: 8px;
    padding: 12px;
    margin-top: -8px;
    font-size: 12px;
    color: #cbd5e1;
    z-index: 10;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    line-height: 1.5;
  }

  .options-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .option-label {
    display: flex;
    align-items: center;
    padding: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    background-color: #334155;
    border: 2px solid #475569;
  }

  .option-label:hover {
    background-color: #475569;
  }

  .option-label.selected {
    background-color: rgba(251, 191, 36, 0.2);
    border-color: #fbbf24;
    box-shadow: 0 0 8px rgba(251, 191, 36, 0.2);
  }

  .option-label input[type="radio"] {
    width: 20px;
    height: 20px;
    margin-right: 16px;
    cursor: pointer;
    accent-color: #fbbf24;
  }

  .option-label span {
    color: #e2e8f0;
    flex: 1;
  }

  .buttons-container {
    display: flex;
    gap: 16px;
    margin-top: 32px;
  }

  .btn {
    flex: 1;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    border: none;
    font-size: 16px;
  }

  .btn-secondary {
    background-color: transparent;
    border: 2px solid #475569;
    color: #e2e8f0;
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: #475569;
  }

  .btn-secondary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background-color: #fbbf24;
    color: #1f2937;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-primary:hover {
    background-color: #f59e0b;
  }

  .footer {
    text-align: center;
    color: #94a3b8;
    font-size: 12px;
    margin-top: 32px;
  }

  .results-container {
    min-height: 100vh;
    background: linear-gradient(to bottom right, #030712, #0f172a, #1a1f35);
    color: white;
    padding: 24px;
  }

  .results-wrapper {
    max-width: 800px;
    margin: 0 auto;
    padding-top: 32px;
  }

  .results-header {
    text-align: center;
    margin-bottom: 48px;
  }

  .results-header h1 {
    font-size: 32px;
    font-weight: 700;
    color: #fbbf24;
    margin-bottom: 8px;
  }

  .risk-score {
    border: 2px solid;
    border-radius: 12px;
    padding: 32px;
    margin-bottom: 32px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .risk-score.low {
    background-color: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.3);
  }

  .risk-score.medium {
    background-color: rgba(251, 191, 36, 0.1);
    border-color: rgba(251, 191, 36, 0.3);
  }

  .risk-score.high {
    background-color: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.3);
  }

  .risk-score.critical {
    background-color: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.5);
  }

  .risk-text h2 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .risk-text p {
    font-size: 12px;
    margin-bottom: 8px;
    opacity: 0.9;
  }

  .risk-icon {
    font-size: 48px;
    flex-shrink: 0;
    margin-left: 16px;
  }

  .recommendations-card {
    background-color: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
  }

  .recommendations-card h3 {
    color: #fbbf24;
    font-weight: 700;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .recommendations-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .recommendation-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px;
    background-color: rgba(251, 191, 36, 0.05);
    border-left: 3px solid #fbbf24;
    border-radius: 4px;
  }

  .recommendation-item .icon {
    color: #fbbf24;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .recommendation-item p {
    color: #cbd5e1;
    font-size: 14px;
    line-height: 1.5;
  }

  .breakdown-card {
    background-color: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
  }

  .breakdown-card h3 {
    color: #fbbf24;
    font-weight: 700;
    margin-bottom: 16px;
  }

  .breakdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #475569;
  }

  .breakdown-item:last-child {
    border-bottom: none;
  }

  .breakdown-label {
    color: #e2e8f0;
    flex: 1;
  }

  .breakdown-score {
    color: #fbbf24;
    font-weight: 700;
  }

  .company-info {
    background-color: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
  }

  .company-info h3 {
    color: #fbbf24;
    font-weight: 700;
    margin-bottom: 16px;
  }

  .company-item {
    color: #cbd5e1;
    margin-bottom: 8px;
    font-size: 14px;
  }

  .contact-form {
    background-color: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
  }

  .contact-form h3 {
    color: #fbbf24;
    font-weight: 700;
    margin-bottom: 16px;
  }

  .form-input {
    width: 100%;
    background-color: #334155;
    border: 1px solid #475569;
    color: white;
    padding: 12px 16px;
    margin-bottom: 12px;
    border-radius: 8px;
    font-size: 14px;
  }

  .form-input:focus {
    outline: none;
    border-color: #fbbf24;
    box-shadow: 0 0 8px rgba(251, 191, 36, 0.2);
  }

  .form-input::placeholder {
    color: #94a3b8;
  }

  .consent-card {
    background-color: #1e293b;
    border: 1px solid #475569;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
  }

  .consent-card h3 {
    color: #fbbf24;
    font-weight: 700;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .consent-item {
    background-color: rgba(251, 191, 36, 0.05);
    border: 1px solid rgba(251, 191, 36, 0.2);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
  }

  .consent-item label {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    cursor: pointer;
  }

  .consent-item input[type="checkbox"] {
    width: 20px;
    height: 20px;
    margin-top: 2px;
    cursor: pointer;
    accent-color: #fbbf24;
    flex-shrink: 0;
  }

  .consent-text {
    color: #cbd5e1;
    font-size: 13px;
    line-height: 1.6;
  }

  .consent-text strong {
    color: #fbbf24;
  }

  .consent-details {
    background-color: #0f172a;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 16px;
    margin-top: 12px;
    font-size: 12px;
    color: #94a3b8;
    max-height: 150px;
    overflow-y: auto;
    line-height: 1.6;
  }

  .btn-whatsapp {
    width: 100%;
    background: linear-gradient(90deg, #22c55e, #16a34a);
    color: white;
    padding: 16px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 16px;
    border: none;
  }

  .btn-whatsapp:hover:not(:disabled) {
    transform: scale(1.02);
    box-shadow: 0 8px 16px rgba(34, 197, 94, 0.3);
  }

  .btn-whatsapp:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .cta-footer {
    background: linear-gradient(90deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8));
    border: 1px solid rgba(251, 191, 36, 0.3);
    border-radius: 12px;
    padding: 24px;
    text-align: center;
  }

  .cta-footer p {
    color: #cbd5e1;
    margin-bottom: 8px;
    font-size: 14px;
  }

  .cta-footer .brand {
    color: #fbbf24;
    font-weight: 600;
    font-size: 14px;
  }

  .error-text {
    color: #ef4444;
    font-size: 12px;
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const tooltips = {
  q1: "Art. 27 Ley 21.719: Designar responsable de protección de datos es fundamental para gobernanza.",
  q2: "Tener un comité de revisión demuestra compromiso con la privacidad y cumplimiento normativo.",
  q3: "Art. 5 Ley 21.719: Conocer qué datos tratas es esencial. Se requiere catálogo documentado.",
  q4: "Art. 6 Ley 21.719: Los datos sensibles (salud, biometría, etc.) requieren protección reforzada.",
  q5: "Art. 5 Ley 21.719: Debes saber dónde están tus datos (cloud, servidores, terceros).",
  q6: "Art. 5 Ley 21.719: La política de privacidad es requisito legal. Debe estar publicada y clara.",
  q7: "Art. 5 Ley 21.719: Cada dato debe tener un propósito específico documentado.",
  q8: "Art. 12 Ley 21.719: Debes tener proceso formal para acceso, rectificación y eliminación de datos.",
  q9: "Art. 10 Ley 21.719: Aplicar medidas de seguridad técnica es obligatorio.",
  q10: "Art. 5 Ley 21.719: Los contratos con terceros deben incluir cláusulas de protección de datos.",
  q11: "Art. 8 Ley 21.719: Transferencias internacionales requieren protección equivalente documentada.",
  q12: "Art. 13 Ley 21.719: Las decisiones automatizadas deben ser transparentes y permitir cuestionamiento.",
  q13: "Art. 6 Ley 21.719: Los datos de menores requieren protección especial y consentimiento parental.",
  q14: "Art. 7 Ley 21.719: Debes definir período de retención para cada tipo de dato.",
  q15: "Art. 19 Ley 21.719: Necesitas protocolo para reportar brechas en 72 horas a la Agencia.",
  q16: "Art. 5 Ley 21.719: Capacitar al equipo es clave para cumplimiento sostenible.",
  q17: "La Agencia de Protección de Datos comienza fiscalización el 1 de diciembre de 2026.",
};

const getRecommendations = (score, riesgo) => {
  if (riesgo.class === 'low') {
    return [
      "✅ Mantener y mejorar prácticas actuales",
      "🔍 Realizar auditoría externa previa a diciembre 2026 (recomendado)",
      "📚 Capacitar periódicamente al equipo sobre novedades legales"
    ];
  }
  if (riesgo.class === 'medium') {
    return [
      "⚠️ Documentar política de privacidad formal",
      "🔐 Implementar controles de seguridad básicos",
      "👤 Designar responsable de protección de datos",
      "📋 Crear catálogo de datos tratados"
    ];
  }
  if (riesgo.class === 'high') {
    return [
      "🔴 URGENTE: Realizar assessment profundo con especialista",
      "📝 Desarrollar política de privacidad completa",
      "🔒 Implementar medidas de seguridad técnica",
      "📞 Iniciar implementación de cumplimiento (timeline: 12-16 semanas)",
      "👨‍💼 Designar comité de gobernanza de datos"
    ];
  }
  return [
    "⛔ CRÍTICO: Contactar especialista INMEDIATAMENTE",
    "📋 Realizar assessment de emergencia",
    "🏗️ Plan de implementación acelerado (8-12 semanas)",
    "⚖️ Asesoramiento legal especializado",
    "🔒 Medidas de seguridad críticas de inmediato",
    "👥 Designar responsable dedicado a protección de datos"
  ];
};

export default function DiagnosticForm() {
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [consentChecked, setConsentChecked] = useState({
    contact: false,
    treatment: false,
    understanding: false
  });
  const [contactData, setContactData] = useState({ 
    nombre: '', 
    email: '', 
    empresa: '', 
    telefono: '',
    tamaño: '',
    rubro: ''
  });
  const [hoveredTooltip, setHoveredTooltip] = useState(null);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = CSS_STYLES;
    document.head.appendChild(styleElement);

    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.background = 'linear-gradient(135deg, #030712 0%, #0f172a 50%, #1a1f35 100%)';
    document.body.style.color = 'white';
    document.body.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif";

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const sections = [
    {
      title: 'Gobernanza y Estructura',
      subtitle: 'Riesgo Organizacional',
      icon: '🏢',
      questions: [
        { id: 'q1', text: '¿Has designado a una persona responsable de la protección de datos?', options: [
          { label: 'Sí, responsable formalmente designado', weight: 0 },
          { label: 'Tenemos alguien informalmente', weight: 2 },
          { label: 'No, aún no asignamos', weight: 3 },
          { label: 'No sé / No aplica', weight: 2 },
        ]},
        { id: 'q2', text: '¿Existe un comité que revise cómo tratas datos personales?', options: [
          { label: 'Sí, comité formal que se reúne regularmente', weight: 0 },
          { label: 'Reuniones informales ocasionales', weight: 2 },
          { label: 'No existe ninguna instancia', weight: 3 },
          { label: 'No sé / No aplica', weight: 2 },
        ]},
      ],
    },
    {
      title: 'Inventario y Visibilidad',
      subtitle: 'Riesgo de Control',
      icon: '📋',
      questions: [
        { id: 'q3', text: '¿Has mapeado qué datos personales recolectas y tratas?', options: [
          { label: 'Sí, catálogo completo y actualizado', weight: 0 },
          { label: 'Parcialmente documentado', weight: 1 },
          { label: 'Idea general sin documentación formal', weight: 2 },
          { label: 'No, sin claridad sobre qué datos tratamos', weight: 3 },
        ]},
        { id: 'q4', text: '¿Tratas datos sensibles? (salud, religión, biométricos, menores, etc.)', options: [
          { label: 'No, solo datos básicos', weight: 0 },
          { label: 'Algunos sensibles limitados', weight: 1 },
          { label: 'Sí, y está documentado control', weight: 0 },
          { label: 'Sí, sin control específico documentado', weight: 3 },
        ]},
        { id: 'q5', text: '¿Sabes dónde se almacenan los datos? (servidores, nube, terceros)', options: [
          { label: 'Visibilidad completa', weight: 0 },
          { label: 'Parcialmente, distribuido', weight: 1 },
          { label: 'Distribuido sin control centralizado', weight: 2 },
          { label: 'Sin visibilidad clara', weight: 3 },
        ]},
      ],
    },
    {
      title: 'Políticas y Documentación',
      subtitle: 'Riesgo Legal',
      icon: '📄',
      questions: [
        { id: 'q6', text: '¿Tienes política de protección de datos publicada en tu web?', options: [
          { label: 'Sí, actualizada según ley 21.719', weight: 0 },
          { label: 'Sí, pero antigua/desactualizada', weight: 2 },
          { label: 'Algo informal, no formalizado', weight: 2 },
          { label: 'No tenemos política', weight: 3 },
        ]},
        { id: 'q7', text: '¿Documentaste el propósito específico de cada dato?', options: [
          { label: 'Sí, cada dato tiene propósito documentado', weight: 0 },
          { label: 'Aproximadamente, sin formalizar', weight: 1 },
          { label: 'No, recolectamos genéricamente', weight: 3 },
          { label: 'No sé / No aplica', weight: 2 },
        ]},
        { id: 'q8', text: '¿Tienes proceso para solicitudes (acceso, rectificación, eliminación)?', options: [
          { label: 'Sí, formalizados con plazos de 20 días', weight: 0 },
          { label: 'Parcialmente, sin proceso formal', weight: 2 },
          { label: 'No tenemos proceso definido', weight: 3 },
          { label: 'No sabía que fuera obligatorio', weight: 3 },
        ]},
      ],
    },
    {
      title: 'Seguridad Técnica',
      subtitle: 'Riesgo de Brechas',
      icon: '🔐',
      questions: [
        { id: 'q9', text: '¿Tienes medidas de seguridad técnicas?', options: [
          { label: 'Sí, según ISO 27001 o similar', weight: 0 },
          { label: 'Sí, básicas pero sin evaluación formal', weight: 1 },
          { label: 'Algunas medidas informales', weight: 2 },
          { label: 'Medidas mínimas o ninguna', weight: 3 },
        ]},
        { id: 'q10', text: '¿Compartes datos con terceros/proveedores con contrato?', options: [
          { label: 'Sí, con contratos de tratamiento específicos', weight: 0 },
          { label: 'Sí, pero sin protecciones en contratos', weight: 2 },
          { label: 'Sí, sin formalizar nada', weight: 3 },
          { label: 'No compartimos datos con terceros', weight: 0 },
        ]},
        { id: 'q11', text: '¿Trasfieres datos al extranjero?', options: [
          { label: 'No, todo en Chile', weight: 0 },
          { label: 'Sí, con protección equivalente documentada', weight: 0 },
          { label: 'Sí, sin evaluar protección del país', weight: 2 },
          { label: 'Sí, a países de alto riesgo', weight: 3 },
        ]},
      ],
    },
    {
      title: 'Decisiones Automatizadas',
      subtitle: 'Riesgo de Discriminación',
      icon: '🤖',
      questions: [
        { id: 'q12', text: '¿Usas sistemas automatizados para decisiones?', options: [
          { label: 'No utilizamos automatización para decisiones', weight: 0 },
          { label: 'Sí, con supervisión humana documentada', weight: 1 },
          { label: 'Sí, sin saber cómo decide el sistema', weight: 3 },
          { label: 'Sí, sin derechos de cuestionamiento', weight: 3 },
        ]},
        { id: 'q13', text: '¿Tienes datos de menores de edad?', options: [
          { label: 'No tenemos datos de menores', weight: 0 },
          { label: 'Sí, con protecciones especiales documentadas', weight: 0 },
          { label: 'Sí, tratamos igual que adultos', weight: 3 },
          { label: 'Sí, sin evaluar riesgos', weight: 3 },
        ]},
      ],
    },
    {
      title: 'Tiempo y Seguridad',
      subtitle: 'Riesgo Operacional',
      icon: '⏱️',
      questions: [
        { id: 'q14', text: '¿Definiste cuánto tiempo conservarás cada dato?', options: [
          { label: 'Sí, con política de eliminación documentada', weight: 0 },
          { label: 'Aproximadamente, informalmente', weight: 1 },
          { label: 'Tenemos datos sin fecha de eliminación', weight: 2 },
          { label: 'No, guardamos indefinidamente', weight: 3 },
        ]},
        { id: 'q15', text: '¿Tienes protocolo para reportar brechas de seguridad?', options: [
          { label: 'Sí, formalizado con pasos y responsables', weight: 0 },
          { label: 'Parcialmente, sin documentación formal', weight: 2 },
          { label: 'No tenemos protocolo definido', weight: 3 },
          { label: 'No sabía que esto fuera requerido', weight: 3 },
        ]},
      ],
    },
    {
      title: 'Capacitación y Regulación',
      subtitle: 'Riesgo de Incumplimiento',
      icon: '📚',
      questions: [
        { id: 'q16', text: '¿Capacitaste tu equipo sobre ley 21.719?', options: [
          { label: 'Sí, capacitación formal y periódica', weight: 0 },
          { label: 'Mínima o informal', weight: 2 },
          { label: 'No, no hemos capacitado', weight: 3 },
          { label: 'No sé / No aplica', weight: 2 },
        ]},
        { id: 'q17', text: '¿Sabes de la Agencia de Protección de Datos que fiscaliza desde dic 2026?', options: [
          { label: 'Sí, y estamos preparados para cumplir', weight: 0 },
          { label: 'Sí, pero no sabemos implicaciones', weight: 2 },
          { label: 'Vagamente, sin detalles', weight: 2 },
          { label: 'No, no sabía', weight: 3 },
        ]},
      ],
    },
    {
      title: 'Tu Empresa',
      subtitle: 'Información para Análisis Personalizado',
      icon: '🏭',
      questions: [
        { id: 'q18_tamaño', text: '¿Cuál es el tamaño de tu empresa?', options: [
          { label: 'Micro empresa (1-10 empleados)', weight: 0, category: 'tamaño' },
          { label: 'Pequeña (11-50 empleados)', weight: 0, category: 'tamaño' },
          { label: 'Mediana (51-200 empleados)', weight: 0, category: 'tamaño' },
          { label: 'Grande (200+ empleados)', weight: 0, category: 'tamaño' },
        ]},
        { id: 'q19_rubro', text: '¿Cuál es tu rubro/sector?', options: [
          { label: 'Tecnología / Software / SaaS', weight: 0, category: 'rubro' },
          { label: 'E-commerce / Retail', weight: 0, category: 'rubro' },
          { label: 'Salud / Farmacéutica', weight: 0, category: 'rubro' },
          { label: 'Educación', weight: 0, category: 'rubro' },
          { label: 'Finanzas / Banca / Seguros', weight: 0, category: 'rubro' },
          { label: 'Construcción / Inmobiliario', weight: 0, category: 'rubro' },
          { label: 'Manufactura / Industria', weight: 0, category: 'rubro' },
          { label: 'Servicios Profesionales', weight: 0, category: 'rubro' },
          { label: 'Otro', weight: 0, category: 'rubro' },
        ]},
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
      class: 'low',
      recommendation: 'Tu empresa tiene buena base en protección de datos. Solo mejoras menores necesarias.' 
    };
    if (score <= 12) return { 
      level: '🟡 RIESGO MODERADO', 
      class: 'medium',
      recommendation: 'Hay gaps importantes en políticas y documentación que requieren atención.' 
    };
    if (score <= 25) return { 
      level: '🔴 RIESGO ALTO', 
      class: 'high',
      recommendation: 'Tu empresa tiene exposición significativa a incumplimientos.' 
    };
    return { 
      level: '🔴🔴 RIESGO CRÍTICO', 
      class: 'critical',
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

He autorizado a Axis Continuity a contactarme y procesar mis datos conforme a su política de privacidad.

Me gustaría conocer más sobre cómo optimizar mi cumplimiento con la ley. ¿Podemos agendar una llamada?`;
    
    return encodeURIComponent(message);
  };

  const handleAnswerSelect = (questionId, option) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: option,
    }));

    if (questionId === 'q18_tamaño') {
      setContactData(prev => ({ ...prev, tamaño: option.label }));
    }
    if (questionId === 'q19_rubro') {
      setContactData(prev => ({ ...prev, rubro: option.label }));
    }
  };

  const handleWhatsApp = () => {
    if (!contactData.email || !consentChecked.treatment || !consentChecked.understanding) {
      alert('Por favor completa tu email y acepta el tratamiento de datos.');
      return;
    }

    const waLink = `https://wa.me/56953348133?text=${getWhatsAppMessage(calculateScore, contactData.empresa, contactData.nombre, contactData.tamaño, contactData.rubro)}`;
    window.open(waLink, '_blank');
  };

  const section = sections[currentSection];
  const progress = ((currentSection + 1) / sections.length) * 100;
  const risk = getRiskLevel(calculateScore);
  const recommendations = getRecommendations(calculateScore, risk);

  if (showConsent) {
    return (
      <div className="results-container">
        <div className="results-wrapper">
          <div className="results-header">
            <h1>Protección de tus Datos</h1>
            <p style={{ color: '#cbd5e1' }}>Consentimiento y Tratamiento según Ley 21.719</p>
          </div>

          <div className="consent-card">
            <h3>
              <AlertCircle size={20} />
              Información Importante
            </h3>
            <p style={{ color: '#cbd5e1', marginBottom: '16px', lineHeight: '1.6' }}>
              Antes de contactarte por WhatsApp, necesitamos tu consentimiento explícito para el tratamiento de tus datos personales. Axis Continuity respeta la Ley 21.719 de Protección de Datos Personales.
            </p>
          </div>

          <div className="consent-card">
            <h3>
              <CheckCircle size={20} />
              Tu Consentimiento
            </h3>

            <div className="consent-item">
              <label>
                <input
                  type="checkbox"
                  checked={consentChecked.contact}
                  onChange={(e) => setConsentChecked({...consentChecked, contact: e.target.checked})}
                />
                <div className="consent-text">
                  <strong>Consentimiento de Contacto</strong><br/>
                  Autorizo a Axis Continuity a contactarme por WhatsApp, email o teléfono basado en mis datos (nombre, email, empresa, teléfono) para: (a) enviar resultados del diagnóstico, (b) ofrecer servicios de assessment e implementación, (c) compartir contenido educativo sobre Ley 21.719.
                </div>
              </label>
            </div>

            <div className="consent-item">
              <label>
                <input
                  type="checkbox"
                  checked={consentChecked.treatment}
                  onChange={(e) => setConsentChecked({...consentChecked, treatment: e.target.checked})}
                />
                <div className="consent-text">
                  <strong>Tratamiento de Datos (Art. 5, Ley 21.719)</strong><br/>
                  Entiendo y acepto que Axis Continuity tratará mis datos personales para:
                  <div className="consent-details">
                    • Propósito: Ofrecer servicios de consultoría en cumplimiento Ley 21.719<br/>
                    • Legítimidad: Consentimiento informado (este formulario)<br/>
                    • Almacenamiento: Servidores de Vercel y HubSpot CRM (ubicados en USA)<br/>
                    • Retención: Máximo 24 meses desde último contacto<br/>
                    • Transferencia: No se compartirá sin autorización previa<br/>
                    • Derechos: Acceso, rectificación, eliminación mediante mail a contacto@axiscontinuity.cl<br/>
                    • Tiempo de respuesta: 20 días hábiles
                  </div>
                </div>
              </label>
            </div>

            <div className="consent-item">
              <label>
                <input
                  type="checkbox"
                  checked={consentChecked.understanding}
                  onChange={(e) => setConsentChecked({...consentChecked, understanding: e.target.checked})}
                />
                <div className="consent-text">
                  <strong>Declaración de Entendimiento</strong><br/>
                  Confirmo que he leído y entendido: (a) esta información de consentimiento, (b) la política de privacidad de Axis Continuity disponible en axiscontinuity.cl/privacidad, (c) mis derechos según Ley 21.719.
                </div>
              </label>
            </div>
          </div>

          <div className="consent-card">
            <h3>📋 Responsable de Tratamiento</h3>
            <p style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '8px' }}>
              <strong>Empresa:</strong> Axis Continuity SpA<br/>
              <strong>Email:</strong> contacto@axiscontinuity.cl<br/>
              <strong>Política de Privacidad:</strong> axiscontinuity.cl/privacidad<br/>
              <strong>Reclamos:</strong> Agencia de Protección de Datos (www.protecciondatos.gob.cl)
            </p>
          </div>

          <div className="disclaimer-box">
            <strong>⚖️ DISCLAIMER LEGAL:</strong> Este diagnóstico es orientativo y no constituye asesoramiento legal. Axis Continuity respeta la Ley 21.719. Tus datos se protegen con estándares de seguridad de industria. No somos responsables por uso incorrecto de la información generada.
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <button
              onClick={() => setShowConsent(false)}
              className="btn btn-secondary"
            >
              Volver Atrás
            </button>
            <button
              onClick={() => {
                if (consentChecked.contact && consentChecked.treatment && consentChecked.understanding) {
                  handleWhatsApp();
                } else {
                  alert('Por favor marca todas las casillas para continuar.');
                }
              }}
              className="btn-whatsapp"
              disabled={!consentChecked.contact || !consentChecked.treatment || !consentChecked.understanding}
            >
              <MessageCircle size={24} />
              Contactar por WhatsApp
            </button>
          </div>

          <div className="footer">
            <p>Ley Nº 21.719 | Agencia de Protección de Datos</p>
            <p style={{ marginTop: '8px' }}>© 2026 Axis Continuity - Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="results-container">
        <div className="results-wrapper">
          <div className="results-header">
            <h1>Tu Diagnóstico está Listo</h1>
            <p style={{ color: '#cbd5e1' }}>Protección de Datos Personales - Ley 21.719</p>
          </div>

          <div className={`risk-score ${risk.class}`}>
            <div className="risk-text">
              <h2>{risk.level}</h2>
              <p>Score: {calculateScore}/51 puntos</p>
            </div>
            <div className="risk-icon">{risk.class === 'low' ? '✅' : risk.class === 'medium' ? '⚠️' : risk.class === 'high' ? '🚨' : '⛔'}</div>
          </div>

          <p style={{ color: '#cbd5e1', marginBottom: '32px', lineHeight: '1.6' }}>{risk.recommendation}</p>

          <div className="recommendations-card">
            <h3>
              <CheckCircle size={18} />
              Próximos Pasos Recomendados
            </h3>
            <div className="recommendations-list">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="recommendation-item">
                  <div className="icon">→</div>
                  <p>{rec}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="breakdown-card">
            <h3>Riesgos por Área</h3>
            {sections.slice(0, 7).map((sec, idx) => {
              const secQuestions = sec.questions;
              let secScore = 0;
              secQuestions.forEach((q) => {
                if (responses[q.id]) {
                  secScore += responses[q.id].weight;
                }
              });
              return (
                <div key={idx} className="breakdown-item">
                  <span className="breakdown-label">
                    <span style={{ marginRight: '8px' }}>{sec.icon}</span>
                    {sec.title}
                  </span>
                  <span className="breakdown-score">{secScore} pts</span>
                </div>
              );
            })}
          </div>

          <div className="company-info">
            <h3>Información de tu Empresa</h3>
            {contactData.tamaño && (
              <div className="company-item">
                <strong style={{ color: '#fbbf24' }}>Tamaño:</strong> {contactData.tamaño}
              </div>
            )}
            {contactData.rubro && (
              <div className="company-item">
                <strong style={{ color: '#fbbf24' }}>Rubro:</strong> {contactData.rubro}
              </div>
            )}
          </div>

          <div className="contact-form">
            <h3>Tu Información de Contacto</h3>
            <input
              type="text"
              placeholder="Tu nombre"
              value={contactData.nombre}
              onChange={(e) => setContactData({ ...contactData, nombre: e.target.value })}
              className="form-input"
            />
            <input
              type="email"
              placeholder="Tu email *"
              value={contactData.email}
              onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
              className="form-input"
              required
            />
            {!contactData.email && <div className="error-text"><AlertCircle size={14} /> Email requerido</div>}
            <input
              type="text"
              placeholder="Nombre de tu empresa"
              value={contactData.empresa}
              onChange={(e) => setContactData({ ...contactData, empresa: e.target.value })}
              className="form-input"
            />
            <input
              type="tel"
              placeholder="Teléfono (opcional)"
              value={contactData.telefono}
              onChange={(e) => setContactData({ ...contactData, telefono: e.target.value })}
              className="form-input"
            />
          </div>

          <button
            onClick={() => setShowConsent(true)}
            className="btn-whatsapp"
          >
            <MessageCircle size={24} />
            Contactar por WhatsApp
          </button>

          <div className="cta-footer">
            <p>¿Prefieres que te contactemos de otra forma?</p>
            <div className="brand">
              Axis Continuity<br />
              Consultoría Especializada en Cumplimiento & Riesgos<br/>
              contacto@axiscontinuity.cl
            </div>
          </div>

          <div className="footer">
            <p>Ley Nº 21.719 | Vigencia: 1 de diciembre de 2026</p>
            <p style={{ marginTop: '8px' }}>© 2026 Axis Continuity - Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="diagnostic-container">
      <div className="diagnostic-wrapper">
        <div className="header">
          <div className="badge">LEY 21.719</div>
          <h1>Diagnóstico de Riesgo</h1>
          <p>Protección de Datos Personales - 5 minutos</p>
        </div>

        <div className="disclaimer-box">
          <strong>📋 DISCLAIMER LEGAL:</strong> Este diagnóstico es orientativo y NO constituye asesoramiento legal. Basado en Ley 21.719 de Protección de Datos Personales. Consulta con especialista para cumplimiento certero. Tus datos se protegen según Ley 21.719.
        </div>

        <div className="progress-container">
          <div className="progress-info">
            <span className="progress-label">{currentSection + 1} de {sections.length}</span>
            <span className="progress-score">Score: <span className="score-value">{calculateScore}</span> pts</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="section-card">
          <div className="section-header">
            <span className="section-icon">{section.icon}</span>
            <div>
              <h2 className="section-title">{section.title}</h2>
              <p className="section-subtitle">{section.subtitle}</p>
            </div>
          </div>

          <div className="questions-container">
            {section.questions.map((question) => (
              <div key={question.id} className="question-group">
                <div className="question-header">
                  <p className="question-text">{question.text}</p>
                  <div 
                    className="tooltip-icon"
                    onMouseEnter={() => setHoveredTooltip(question.id)}
                    onMouseLeave={() => setHoveredTooltip(null)}
                  >
                    <Info size={18} />
                    {hoveredTooltip === question.id && (
                      <div className="tooltip-text" style={{ position: 'absolute', right: 0 }}>
                        {tooltips[question.id]}
                      </div>
                    )}
                  </div>
                </div>
                <div className="options-container">
                  {question.options.map((option, idx) => (
                    <label
                      key={idx}
                      className={`option-label ${responses[question.id]?.label === option.label ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option.label}
                        checked={responses[question.id]?.label === option.label}
                        onChange={() => handleAnswerSelect(question.id, option)}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="buttons-container">
          <button
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
            className="btn btn-secondary"
          >
            Anterior
          </button>

          {currentSection === sections.length - 1 ? (
            <button onClick={() => setShowResults(true)} className="btn btn-primary">
              Ver Resultados
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
              className="btn btn-primary"
            >
              Siguiente
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        <div className="footer">
          <p>Ley Nº 21.719 | Entrada en vigor: 1 de diciembre de 2026</p>
          <p style={{ marginTop: '8px' }}>© 2026 Axis Continuity</p>
        </div>
      </div>
    </div>
  );
}
