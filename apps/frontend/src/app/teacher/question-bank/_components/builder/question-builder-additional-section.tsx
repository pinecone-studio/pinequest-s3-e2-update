"use client";

import { FormulaEditor } from "../shared/formula-editor";
import { ImageUploader } from "../shared/image-uploader";

type QuestionBuilderAdditionalSectionProps = {
  formulaError?: string;
  formulaHelpers?: Array<{ label: string; value: string }>;
  formulaRaw: string;
  imageError?: string;
  imageUrl: string;
  includesFormula: boolean;
  includesImage: boolean;
  onFormulaChange: (value: string) => void;
  onImageChange: (value: string) => void;
  supportsFormulaInput: boolean;
};

export function QuestionBuilderAdditionalSection({
  formulaError,
  formulaHelpers = [],
  formulaRaw,
  imageError,
  imageUrl,
  includesFormula,
  includesImage,
  onFormulaChange,
  onImageChange,
  supportsFormulaInput,
}: QuestionBuilderAdditionalSectionProps) {
  return (
    <section className="rounded-3xl border border-[#d8e2f0] bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#183153]">Нэмэлт оролт</h3>
        <p className="text-sm text-[#6d7f9c]">
          Зураг эсвэл томьёо хэрэгтэй гэж сонгосон үед доорх хэсгүүд автоматаар
          гарч ирнэ.
        </p>
      </div>

      {includesImage || includesFormula ? (
        <div className="space-y-6">
          {includesImage ? (
            <div className="rounded-2xl border border-[#dce5f2] bg-[#f8fbff] p-4">
              <div className="mb-3">
                <h3 className="text-base font-semibold text-[#183153]">
                  Зургийн хэсэг
                </h3>
                <p className="text-sm text-[#6d7f9c]">
                  Асуултад зураг нэмэх бол эндээс upload хийнэ.
                </p>
              </div>
              <ImageUploader
                error={imageError}
                imageUrl={imageUrl}
                onChange={onImageChange}
              />
            </div>
          ) : null}

          {supportsFormulaInput && includesFormula ? (
            <div className="rounded-2xl border border-[#dce5f2] bg-[#f8fbff] p-4">
              <div className="mb-3">
                <h3 className="text-base font-semibold text-[#183153]">
                  Томьёоны хэсэг
                </h3>
                <p className="text-sm text-[#6d7f9c]">
                  Сонгосон хичээлд тохирох тэмдэглэгээг ашиглаад томьёогоо
                  нэмнэ үү.
                </p>
              </div>
              <FormulaEditor
                error={formulaError}
                helperTokens={formulaHelpers}
                onChange={onFormulaChange}
                value={formulaRaw}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#d8e2f0] bg-[#f8fbff] px-4 py-5 text-sm text-[#6d7f9c]">
          Одоогоор нэмэлт зураг эсвэл томьёоны panel идэвхжээгүй байна.
        </div>
      )}
    </section>
  );
}
