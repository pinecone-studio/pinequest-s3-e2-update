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
    <section>
      <div className="mb-4 ml-1">
        <h3 className=" text-[13px] font-semibold text-[#171717]">
          Нэмэлт оролт
        </h3>
        <p className="text-[13px] text-[#a3a3a3]">
          Зураг эсвэл томьёо хэрэгтэй гэж сонгосон үед доорх хэсгүүд автоматаар
          гарч ирнэ.
        </p>
      </div>

      {includesImage || includesFormula ? (
        <div className="space-y-6">
          {includesImage ? (
            <div className="rounded-[12px] border border-[#dce5f2] bg-[#f8fbff] p-4">
              <ImageUploader
                error={imageError}
                imageUrl={imageUrl}
                onChange={onImageChange}
              />
            </div>
          ) : null}

          {supportsFormulaInput && includesFormula ? (
            <div className="rounded-[12px] border border-[#dce5f2] bg-[#f8fbff] p-4">
              <div className="mb-3">
                <h3 className="text-[13px] font-semibold text-[#183153]">
                  Томьёоны хэсэг
                </h3>
                <p className="text-[13px] text-[#6d7f9c]">
                  Сонгосон хичээлд тохирох тэмдэглэгээг ашиглаад томьёогоо нэмнэ
                  үү.
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
        <div className="rounded-[12px] border border-dashed border-[#e5e7eb] bg-white px-4 py-3 text-[13px] text-[#a3a3a3]">
          Одоогоор нэмэлт зураг эсвэл томьёоны panel идэвхжээгүй байна.
        </div>
      )}
    </section>
  );
}
